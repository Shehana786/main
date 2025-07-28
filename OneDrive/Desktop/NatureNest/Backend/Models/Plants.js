const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  stock: { type: Number, required: true },
//caretips
  careTips:
  {
    watering: { type: String },
    sunlight: { type: String },
    soil: { type: String },
    pruning: { type: String },
    temperature: { type: String },
    videoUrl: String, 
  },
  
//Care schedule for automatic reminders (interval in days)
 careSchedule: 
 {
    wateringIntervalDays: { type: Number, default: 7 },
    pruningIntervalDays: { type: Number, default: 30 },
    fertilizingIntervalDays: { type: Number, default: 15 },
  },

  imageUrl: { type: String }, // store image filename
  featured: { type: Boolean, default: false },
}, 
{
  timestamps: true,
});

module.exports = mongoose.model('Plants', plantSchema);
