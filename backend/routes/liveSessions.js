const express = require('express');
const router = express.Router();
const LiveSession = require('../models/LiveSession');

// Get all live sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await LiveSession.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});

// Create a live session
router.post('/', async (req, res) => {
  try {
    const session = new LiveSession(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create live session' });
  }
});

// Update a live session
router.put('/:id', async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update live session' });
  }
});

// Delete a live session
router.delete('/:id', async (req, res) => {
  try {
    await LiveSession.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete live session' });
  }
});

// Register for a session
router.post('/:id/register', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (!userId || userId === 'null' || userId === 'undefined') {
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
router.post('/:id/unregister', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.registeredUsers = (session.registeredUsers || []).filter(id => String(id) !== String(userId));
    session.registeredCount = session.registeredUsers.length;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to unregister' });
  }
});

module.exports = router;
