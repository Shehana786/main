const mongoose = require('mongoose');

const purchasedPlantSchema = new mongoose.Schema({
  userId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true,
          },
  purchaseDate: 
  {
    type: Date,
    default: Date.now,
  },
  lastWatered: 
  {
    type: Date,
    default: Date.now,
  },
  lastPruned: 
  {
    type: Date,
    default: Date.now,
  },
  lastFertilized: 
  {
    type: Date,
    default: Date.now,
  },
}, 
{
  timestamps: true,
});

module.exports = mongoose.model('PurchasedPlant', purchasedPlantSchema);
