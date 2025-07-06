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
    const { userId, moduleId, status, progress, completedAt } = req.body;
    let doc = await Progress.findOne({ userId, moduleId });
    if (doc) {
      doc.status = status || doc.status;
      doc.progress = progress !== undefined ? progress : doc.progress;
      doc.completedAt = completedAt || doc.completedAt;
      await doc.save();
    } else {
      doc = await Progress.create({ userId, moduleId, status, progress, completedAt });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
