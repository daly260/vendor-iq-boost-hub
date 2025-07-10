const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get all progress for a user
router.get('/:userId', async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Create or update progress for a user and module
router.post('/', async (req, res) => {
  try {
    const { userId, moduleId, status, progress, completedAt, lastWatchedTime } = req.body;
    let doc = await Progress.findOne({ userId, moduleId });
    if (doc) {
      doc.status = status || doc.status;
      doc.progress = progress !== undefined ? progress : doc.progress;
      doc.completedAt = completedAt || doc.completedAt;
      if (lastWatchedTime !== undefined) doc.lastWatchedTime = lastWatchedTime;
      await doc.save();
    } else {
      doc = await Progress.create({ userId, moduleId, status, progress, completedAt, lastWatchedTime });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// POST /claim-points
router.post('/claim-points', async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    console.log('Claim points request:', { userId, moduleId });
    const progress = await Progress.findOne({ userId, moduleId });
    console.log('Progress found:', progress);
    if (!progress || progress.progress < 100) {
      return res.status(400).json({ error: 'Module not completed yet.' });
    }
    if (progress.pointsClaimed) {
      return res.status(400).json({ error: 'Points already claimed.' });
    }
    const Module = require('../models/Module');
    const User = require('../models/User');
    const moduleDoc = await Module.findById(moduleId);
    console.log('Module found:', moduleDoc);
    if (!moduleDoc) return res.status(404).json({ error: 'Module not found.' });
    const userDoc = await User.findById(userId);
    console.log('User found:', userDoc);
    if (!userDoc) return res.status(404).json({ error: 'User not found.' });
    console.log('User points before:', userDoc.points, 'Module points:', moduleDoc.points);
    userDoc.points = (userDoc.points || 0) + (moduleDoc.points || 0);
    const nextLevelPoints = (userDoc.level + 1) * 500;
    if (userDoc.points >= nextLevelPoints) {
      userDoc.level += 1;
    }
    await userDoc.save();
    progress.pointsClaimed = true;
    await progress.save();
    console.log('User points after:', userDoc.points);
    res.json({ message: 'Points claimed!', points: userDoc.points });
  } catch (err) {
    console.error('Claim points error:', err);
    res.status(500).json({ error: 'Failed to claim points' });
  }
});

module.exports = router;
