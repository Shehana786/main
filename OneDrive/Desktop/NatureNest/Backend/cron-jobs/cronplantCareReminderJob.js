require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const moment = require('moment-timezone');

const UserPlantCareSchedule = require('../Models/userPlanCareSchedule');
const Reminder = require('../Models/Reminder');

//  MongoDB connection if not already established
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/plantcare', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected for cron job');
  }).catch(err => {
    console.error(' MongoDB connection error in cron job:', err);
  });
}

// Cron job: runs every minute (change to "0 8 * * *" for 8 AM daily)
cron.schedule('* * * * *', async () => {
  try {
    console.log('\n🌱 Running plant care reminder cron job...');

    const timezone = 'America/Toronto';

    const start = moment().tz(timezone).startOf('day').utc().toDate(); // today
    const end = moment().tz(timezone).add(30, 'days').endOf('day').utc().toDate();
    console.log(' Checking schedules between:');
    console.log('   Start:', start.toISOString());
    console.log('   End:', end.toISOString());

    const [watering, pruning, fertilizing] = await Promise.all([
      UserPlantCareSchedule.find({ nextWateringDate: { $gte: start, $lte: end } }).populate('plantId'),
      UserPlantCareSchedule.find({ nextPruningDate: { $gte: start, $lte: end } }).populate('plantId'),
      UserPlantCareSchedule.find({ nextFertilizingDate: { $gte: start, $lte: end } }).populate('plantId'),
    ]);
    console.log("Watering ",watering);
console.log("Fertilizing ",fertilizing);
    const createReminders = async (schedules, type, dateField) => {
      for (const schedule of schedules) {
        const plantName = schedule.plantId?.name || 'Unknown Plant';
        const targetDate = moment(schedule[dateField]).utc();
     
        const dateStart = targetDate.clone().startOf('day').toDate();
        const dateEnd = targetDate.clone().endOf('day').toDate();

        const exists = await Reminder.findOne({
          userId: schedule.userId,
          scheduleId: schedule._id,
          type,
          date: { $gte: dateStart, $lte: dateEnd },
        });

        if (!exists) {
          await Reminder.create({
            userId: schedule.userId,
            scheduleId: schedule._id,
            type,
            date: targetDate.toDate(),
            title: `Time to ${type} your plant: ${plantName}`,
          });
          console.log(`Reminder created: ${type} - ${plantName} (${targetDate.format('YYYY-MM-DD')})`);
        } else {
         console.log(` Reminder already exists: ${type} - ${plantName} (${targetDate.format('YYYY-MM-DD')})`);
        }
      }
    };

    await createReminders(watering, 'watering', 'nextWateringDate');
    await createReminders(pruning, 'pruning', 'nextPruningDate');
    await createReminders(fertilizing, 'fertilizing', 'nextFertilizingDate');

    console.log('All reminders processed.');
  } catch (err) {
    console.error(' Cron job error:', err);
  }
});
