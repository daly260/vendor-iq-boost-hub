const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: String,
  maxParticipants: Number,
  registeredUsers: [String],
  registeredCount: { type: Number, default: 0 },
  startDateTime: String,
  endDateTime: String,
  link: { type: String }, // Add link field
  // ...other fields...
});

module.exports = mongoose.model('LiveSession', liveSessionSchema);