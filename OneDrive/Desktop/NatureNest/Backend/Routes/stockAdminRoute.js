const express = require('express');
const router = express.Router();
const StockController = require('../Controller/stockController');

router.patch('/products/:id/stock',StockController.updateStock);

module.exports=router;