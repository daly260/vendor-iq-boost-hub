const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const ticketRoutes = require('./routes/tickets.js');
const authRoutes = require('./routes/auth.js');
const dashboardRoutes = require('./routes/dashboard.js');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://daliklochar:admin123@cluster1.xz2btvr.mongodb.net/e-learning?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Update User schema to include name and avatar
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  avatar: { type: String },
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  badges: { type: [Object], default: [] },
  joinedDate: { type: String },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Module Schema
const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  duration: Number,
  level: Number,
  prerequisites: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema);

// Progress Schema
const progressSchema = new mongoose.Schema({
  userId: String,
  moduleId: String,
  status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
  score: Number,
  startedAt: Date,
  completedAt: Date,
});
const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

// Ticket Schema
const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['bug', 'question', 'suggestion'] },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: String,
  adminResponse: String,
  adminId: String,
});
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

// Update LiveSession schema to track registered users
const liveSessionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDateTime: String,
  endDateTime: String,
  instructor: String,
  maxParticipants: Number,
  registeredCount: Number,
  registeredUsers: [{ type: String }], // user IDs
  meetingLink: String,
  link: { type: String },
});
const LiveSession = mongoose.models.LiveSession || mongoose.model('LiveSession', liveSessionSchema);

// Routes
app.use('/tickets', ticketRoutes);
app.use('/backend', authRoutes);
app.use('/backend/dashboard', dashboardRoutes); // ✅ New dashboard routes

// Tickets endpoints
app.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});
app.post('/tickets', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// --- MODULES (VIDEOS & QUIZZES) CRUD ---
// GET all modules (optionally filter by type)
app.get('/modules', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const modules = await Module.find(filter);
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});
// GET single module
app.get('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});
// POST create module
app.post('/modules', async (req, res) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add module' });
  }
});
// PUT update module
app.put('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update module' });
  }
});
// DELETE module
app.delete('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete module' });
  }
});


// --- LIVE SESSIONS CRUD ---
// GET all live sessions
app.get('/live-sessions', async (req, res) => {
  try {
    const sessions = await LiveSession.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});
// GET single live session
app.get('/live-sessions/:id', async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Live session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live session' });
  }
});
// POST create live session
app.post('/live-sessions', async (req, res) => {
  try {
    const session = new LiveSession(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create live session' });
  }
});
// PUT update live session
app.put('/live-sessions/:id', async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!session) return res.status(404).json({ error: 'Live session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update live session' });
  }
});
// DELETE live session
app.delete('/live-sessions/:id', async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ error: 'Live session not found' });
    res.json({ message: 'Live session deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete live session' });
  }
});
// Register for a session
app.post('/live-sessions/:id/register', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.log('Attempted registration with invalid userId:', userId);
      return res.status(400).json({ error: 'Invalid userId' });
    }
    const userIdStr = String(userId);
    if (session.registeredUsers.map(String).includes(userIdStr)) return res.status(400).json({ error: 'Already registered' });
    if (session.registeredCount >= session.maxParticipants) return res.status(400).json({ error: 'Session full' });
    session.registeredUsers.push(userIdStr);
    session.registeredCount = session.registeredUsers.length;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to register' });
  }
});
// Unregister from a session
app.post('/live-sessions/:id/unregister', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.registeredUsers = session.registeredUsers.filter(id => id !== userId);
    session.registeredCount = session.registeredUsers.length;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to unregister' });
  }
});

// Leaderboard endpoint
app.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 });
    const leaderboard = users.map((user, idx) => ({
      rank: idx + 1,
      user,
      totalPoints: user.points,
      completedModules: 0, // You can aggregate this from progress if needed
      badgeCount: user.badges ? user.badges.length : 0
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Badges endpoint
app.get('/dashboard/badges', async (req, res) => {
  try {
    // Example static badges, you can replace with DB if needed
    const badges = [
      { id: '1', name: 'Premier Pas', description: 'Complété ton premier module', icon: '🎯', color: 'text-vibrant-green' },
      { id: '2', name: 'Marathonien', description: 'Complété 10 modules', icon: '🏃‍♀️', color: 'text-vibrant-blue' },
      { id: '3', name: 'Quiz Master', description: 'Score parfait sur 5 quiz', icon: '🧠', color: 'text-vibrant-purple' },
      { id: '4', name: 'Perfectionniste', description: 'Complété un module à 100%', icon: '⭐', color: 'text-fun-yellow' },
      { id: '5', name: 'Rapide comme l\'éclair', description: 'Terminé un quiz en moins de 5 minutes', icon: '⚡', color: 'text-vibrant-orange' },
      { id: '6', name: 'Collaborateur', description: 'Participé à 3 sessions live', icon: '🤝', color: 'text-fun-cyan' },
      { id: '7', name: 'Expert', description: 'Atteint le niveau 10', icon: '👑', color: 'text-vibrant-pink' },
      { id: '8', name: 'Mentor', description: 'Aidé 5 autres vendeurs', icon: '🧑‍🏫', color: 'text-vibrant-red' }
    ];
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});
app.get('/backend/dashboard/badges', async (req, res) => {
  try {
    const badges = [
      { id: '1', name: 'Premier Pas', description: 'Complété ton premier module', icon: '🎯', color: 'text-vibrant-green' },
      { id: '2', name: 'Marathonien', description: 'Complété 10 modules', icon: '🏃‍♀️', color: 'text-vibrant-blue' },
      { id: '3', name: 'Quiz Master', description: 'Score parfait sur 5 quiz', icon: '🧠', color: 'text-vibrant-purple' },
      { id: '4', name: 'Perfectionniste', description: 'Complété un module à 100%', icon: '⭐', color: 'text-fun-yellow' },
      { id: '5', name: 'Rapide comme l\'éclair', description: 'Terminé un quiz en moins de 5 minutes', icon: '⚡', color: 'text-vibrant-orange' },
      { id: '6', name: 'Collaborateur', description: 'Participé à 3 sessions live', icon: '🤝', color: 'text-fun-cyan' },
      { id: '7', name: 'Expert', description: 'Atteint le niveau 10', icon: '👑', color: 'text-vibrant-pink' },
      { id: '8', name: 'Mentor', description: 'Aidé 5 autres vendeurs', icon: '🧑‍🏫', color: 'text-vibrant-red' }
    ];
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// Progress endpoint for user progress
app.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ userId }).populate('moduleId');
    const result = progress.map(p => ({
      moduleId: p.moduleId._id,
      title: p.moduleId.title,
      points: p.moduleId.points,
      completedAt: p.completedAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Endpoint to get all users (for admin display)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT update user
app.put('/users/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password && updateData.password.length > 0) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    const user = new User({ email, password, role: role || 'user', name });
    await user.save();
    res.status(201).json({ message: 'User created', user: { _id: user._id, email, role: user.role, name } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Update user (admin panel)
app.put('/backend/users/:id', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const update = { name, email, role };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Utility endpoint to clean up nulls in registeredUsers arrays
app.post('/live-sessions/cleanup-registered-users', async (req, res) => {
  try {
    const sessions = await LiveSession.find();
    for (const session of sessions) {
      session.registeredUsers = (session.registeredUsers || []).filter(id => id && id !== 'null' && id !== 'undefined');
      session.registeredCount = session.registeredUsers.length;
      await session.save();
    }
    res.json({ message: 'Cleaned up nulls in registeredUsers for all sessions.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clean up sessions' });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
