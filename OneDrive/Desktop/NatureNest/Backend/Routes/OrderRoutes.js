const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController');
router.get("/test", (req, res) => {
  res.send("Order route is working!");
});

router.post('/checkout', orderController.createOrder);
module.exports = router;