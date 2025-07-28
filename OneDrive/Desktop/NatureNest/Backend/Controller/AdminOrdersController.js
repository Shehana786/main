const Order = require("../Models/Order");
const User = require("../Models/Users");
const Plant = require('../Models/Plants');
const { Parser } = require("json2csv");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullname email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.exportOrdersCSV = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "fullname email")
      .populate("items.productId", "name");

    const formatted = orders.map(order => ({
      OrderID: order._id,
      Customer: order.userId?.fullname,
      Email: order.userId?.email,
      Total: order.totalPrice,
      Status: order.status,
      CreatedAt: order.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV export failed:", error);
    res.status(500).json({ message: "Failed to export orders" });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { orderIds, newStatus } = req.body;

    if (!Array.isArray(orderIds) || !newStatus) {
      return res.status(400).json({ message: "Invalid data for bulk update" });
    }

    await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { status: newStatus } }
    );

    res.status(200).json({ message: "Statuses updated successfully" });
  } catch (error) {
    console.error("Bulk update failed:", error);
    res.status(500).json({ message: "Failed to update statuses" });
  }
};
