const express = require('express');
const router = express.Router();
const { createBooking } = require('../Controller/bookingController');

router.post('/', createBooking);
module.exports = router;
