const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  icon: String,
  description: String,
  unlockedAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Add this line
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [badgeSchema]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
