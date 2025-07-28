const express = require("express");
const router = express.Router();
const adminOrderController = require("../Controller/AdminOrdersController");

// Get all orders
router.get("/", adminOrderController.getAllOrders);

// Export orders as CSV
router.get("/export", adminOrderController.exportOrdersCSV);

// Bulk status update
router.put("/bulk-status", adminOrderController.bulkUpdateStatus);

module.exports = router;
