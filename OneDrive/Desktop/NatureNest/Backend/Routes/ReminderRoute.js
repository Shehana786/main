const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/Authunticate');
const { getRemindersByDate,getAllReminders } = require('../Controller/reminderController');

router.get('/reminders', authenticate, getRemindersByDate);
router.get('/all/reminders',authenticate,getAllReminders);

module.exports = router;
