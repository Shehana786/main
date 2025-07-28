const Order = require('../Models/Order');
const Product = require('../Models/Plants');
const CareSchedule = require('../Models/userPlanCareSchedule'); // Import your care schedule model

// Utility functions for care dates (you should define these or adjust as needed)
function getWateringDate(plant) {
  // Example: returns current date + 7 days
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}
function getPruningDate(plant) {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}
function getFertilizingDate(plant) {
  const date = new Date();
  date.setDate(date.getDate() + 15);
  return date;
}

exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    console.log("Order received in controller:", req.body);

    if (!userId || !items || !items.length) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    let totalPrice = 0;

    // Validate products and calculate total
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found for ID ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      totalPrice += product.price * item.quantity;
    }

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create and save order
    const order = new Order({
      userId,
      items,
      totalPrice,
      status: 'Pending',
    });

    await order.save();
    console.log(order);

    // Create care schedules for purchased plants
    for (const item of items) {
  console.log('Checking schedule for user:', userId, 'plant:', item.productId);

  const existingSchedule = await CareSchedule.findOne({
    userId: userId,
    plantId: item.productId,
  });

  if (!existingSchedule) {
    console.log('No schedule found, creating one...');
    const product = await Product.findById(item.productId);
    await CareSchedule.create({
      userId: userId,
      plantId: item.productId,
      nextWateringDate: getWateringDate(product),
      nextPruningDate: getPruningDate(product),
      nextFertilizingDate: getFertilizingDate(product),
    });
    console.log('Care schedule created for plant:', item.productId);
  } else {
    console.log('Schedule already exists for plant:', item.productId);
  }
}

    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
