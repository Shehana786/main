const mongoose = require('mongoose');

const careTipSchema = new mongoose.Schema({
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'plants' },
  title: { type: String, required: true },
  topic: { type: String },
  summary: { type: String },
  content: { type: String, required: true },
  thumbnailUrl: { type: String },
}, {
  timestamps: true,
});


module.exports = mongoose.model('caretips', careTipSchema);
