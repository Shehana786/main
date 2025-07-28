const Reminder = require('../Models/Reminder');
const mongoose = require('mongoose');

exports.getRemindersByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const userId = req.user.id;

    console.log('➡️  Reminder request from user:', req.user);
    console.log('Date range:', start, 'to', end);

    // Make sure start and end are valid dates
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Optional: Make end date inclusive
    endDate.setDate(endDate.getDate() + 1);

    // Ensure ObjectId is properly handled
    const objectId = new mongoose.Types.ObjectId(userId);

    const reminders = await Reminder.find({
      userId: objectId,
      date: { $gte: startDate, $lt: endDate }
    });

    console.log(' Reminders fetched:', reminders);
    res.status(200).json(reminders);
  } catch (error) {
    console.error('Failed to fetch reminders:', error.message);
    res.status(500).json({ message: 'Failed to fetch reminders' });
  }
  
};
exports.getAllReminders = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const reminders = await Reminder.find({ userId });
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all reminders' });
  }
};

