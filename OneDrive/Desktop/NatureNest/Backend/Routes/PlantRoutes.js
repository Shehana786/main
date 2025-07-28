const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploads');
const plantController = require('../Controller/plantController');

// These routes are now relative to /api/admin/products
// Add this route to get a specific plant by ID


router.post('/', upload.single('image'), plantController.addPlant);
router.get('/', plantController.getAllPlants);
router.delete('/:id', plantController.deletePlant);
router.put('/:id', upload.single('image'), plantController.updatePlant);
router.get('/categories', plantController.getCategories);
router.get('/featured', plantController.getFeatured);
router.get('/:id', plantController.getPlantById);






module.exports = router;
