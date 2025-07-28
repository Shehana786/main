const mongoose = require('mongoose');

const userPlantCareScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plants', required: true },

  // Last care dates:
  lastWatered: { type: Date },
  lastPruned: { type: Date },
  lastFertilized: { type: Date },

  // Computed next due dates (optional but useful):
  nextWateringDate: { type: Date },
  nextPruningDate: { type: Date },
  nextFertilizingDate: { type: Date },

  remindersEnabled: { type: Boolean, default: true },

  notes: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('UserPlantCareSchedule', userPlantCareScheduleSchema);
