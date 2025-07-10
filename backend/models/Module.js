const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['video', 'quiz', 'guide'], required: true },
  link: { type: String },
  videoUrl: { type: String },
  category: { type: String, enum: ['Analytics', 'Marketing', 'Logistique', 'Stratégie'] },
  difficulty: { type: String, enum: ['Débutant', 'Intermédiaire', 'Avancé'] },
  duration: Number,
  points: Number,
  thumbnail: String,
  downloadUrl: String,
  quizUrl: String,
  relatedModuleId: String,
  question: String,
  choices: [String],
  correctAnswer: String,
}, { timestamps: true });

module.exports = mongoose.models.Module || mongoose.model('Module', moduleSchema);
