const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/Authunticate');
const {
  addCareSchedule,
  getUserSchedules,
  markAsWatered,
  markAsPruned,
  markAsFertilized
} = require('../Controller/CareScheduleController');


// POST: Add new care schedule
router.post('/', authenticate, addCareSchedule);

// GET: Get all care schedules for user
router.get('/', authenticate, getUserSchedules);

// PUT: Mark as watered
router.put('/watered/:id',authenticate, markAsWatered);
router.put('/pruned/:id', authenticate,markAsPruned);
router.put('/fertilized/:id', authenticate,markAsFertilized);


module.exports = router;
