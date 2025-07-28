const UserPlantCareSchedule = require('../Models/userPlanCareSchedule');
const mongoose = require('mongoose');
const { calculateNextDate } = require('../utils/dateUtils');

// Add new care schedule
exports.addCareSchedule = async (req, res) => {
  try {
    const { plantId, lastWatered, lastPruned, lastFertilized, notes } = req.body;

    const newSchedule = new UserPlantCareSchedule({
      userId: req.user._id,
      plantId,
      lastWatered,
      lastPruned,
      lastFertilized,
      nextWateringDate: calculateNextDate(lastWatered, 7),
      nextPruningDate: calculateNextDate(lastPruned, 30),
      nextFertilizingDate: calculateNextDate(lastFertilized, 15),
      notes,
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add schedule', error: err.message });
  }
};

// Get all schedules for the authenticated user
exports.getUserSchedules = async (req, res) => {
  try {
    const schedules = await UserPlantCareSchedule.find({
      userId: new mongoose.Types.ObjectId(req.user.id),
    }).populate('plantId');

    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch schedules', error: err.message });
  }
};

// Mark as watered
exports.markAsWatered = async (req, res) => {
  try {
    const schedule = await UserPlantCareSchedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const today = new Date();
    schedule.lastWatered = today;
    schedule.nextWateringDate = calculateNextDate(today, 7);
    await schedule.save();

    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update watering date', error: err.message });
  }
};

// Mark as pruned
exports.markAsPruned = async (req, res) => {
  try {
    const today = new Date();
    const updated = await UserPlantCareSchedule.findByIdAndUpdate(
      req.params.id,
      {
        lastPruned: today,
        nextPruningDate: calculateNextDate(today, 30),
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating pruning date', error: err.message });
  }
};

// Mark as fertilized
exports.markAsFertilized = async (req, res) => {
  try {
    const today = new Date();
    const updated = await UserPlantCareSchedule.findByIdAndUpdate(
      req.params.id,
      {
        lastFertilized: today,
        nextFertilizingDate: calculateNextDate(today, 14),
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating fertilizing date', error: err.message });
  }
};
