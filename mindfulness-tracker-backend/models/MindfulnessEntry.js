const mongoose = require('mongoose');

const mindfulnessEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  hour: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  presentPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique entries per hour per day
mindfulnessEntrySchema.index({ date: 1, hour: 1 }, { unique: true });

// Update the updatedAt field on save
mindfulnessEntrySchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('MindfulnessEntry', mindfulnessEntrySchema);
