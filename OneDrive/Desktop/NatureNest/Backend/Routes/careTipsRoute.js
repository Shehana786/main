const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploads');
const careTipController = require('../Controller/careTipController');

router.get('/', careTipController.getAllCareTips);
router.get('/:id', careTipController.getCareTipById);
router.post('/', upload.single('thumbnail'), careTipController.createCareTip);
router.put('/:id', upload.single('thumbnail'), careTipController.updateCareTip);
router.delete('/:id', careTipController.deleteCareTip);

module.exports = router;
