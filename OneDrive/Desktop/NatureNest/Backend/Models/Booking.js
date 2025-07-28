const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: { type: String, enum: ['visit', 'delivery'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  plant: { type: String, required: true },
  date: { type: Date, required: true },
  address: { type: String }, // optional for visit
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
