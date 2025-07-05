const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['video', 'quiz', 'guide'], required: true },
  category: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  duration: Number,
  points: Number,
  completed: Boolean,
  progress: Number,
  thumbnail: String,
  videoUrl: String,
  downloadUrl: String,
  quizUrl: String,
}, { timestamps: true });

module.exports = mongoose.models.Module || mongoose.model('Module', moduleSchema);
