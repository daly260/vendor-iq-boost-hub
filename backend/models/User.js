const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  icon: String,
  description: String,
  unlockedAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [badgeSchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
