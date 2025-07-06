const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['video', 'quiz', 'guide'], required: true },
  link: { type: String },
  videoUrl: { type: String },
  category: { type: String, enum: ['Vente', 'Marketing', 'Formation', 'Autre'] },
  difficulty: { type: String, enum: ['Débutant', 'Intermédiaire', 'Avancé'] },
  duration: Number,
  points: Number,
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  thumbnail: String,
  downloadUrl: String,
  quizUrl: String,
}, { timestamps: true });

module.exports = mongoose.models.Module || mongoose.model('Module', moduleSchema);
