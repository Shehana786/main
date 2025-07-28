const Booking = require('../Models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { service, name, email, plant, date, address } = req.body;

    // Optional validation for delivery service
    if (service === 'delivery' && !address) {
      return res.status(400).json({ message: 'Address is required for delivery' });
    }

    const booking = new Booking({ service, name, email, plant, date, address });
    await booking.save();

    res.status(201).json({ message: 'Booking submitted successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting booking', error });
  }
};
