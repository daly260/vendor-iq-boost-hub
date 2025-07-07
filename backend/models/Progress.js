const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  moduleId: { type: String, required: true },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  progress: { type: Number, default: 0 }, // percent watched
  completedAt: Date,
  pointsClaimed: { type: Boolean, default: false },
  lastWatchedTime: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Progress || mongoose.model('Progress', progressSchema);
