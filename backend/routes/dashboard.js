const express = require('express');
const verifyToken = require('../middleware/verifyToken.js');
const User = require('../models/User.js');
const LiveSession = require('../models/LiveSession.js');
const Module = require('../models/Module.js');

const router = express.Router();

// ✅ GET /user — returns logged-in user data
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id,
      name: user.email.split('@')[0],
      email: user.email,
      avatar: `https://i.pravatar.cc/100?u=${user._id}`,
      points: user.points,
      level: user.level,
      badges: user.badges || [],
      role: user.role
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET /modules — dynamic
router.get('/modules', verifyToken, async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    console.error('Error fetching modules:', err);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// ✅ GET /live-sessions — dynamic
router.get('/live-sessions', verifyToken, async (req, res) => {
  try {
    const sessions = await LiveSession.find();
    res.json(sessions);
  } catch (err) {
    console.error('Error fetching live sessions:', err);
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});

// ✅ POST /modules/:id/complete — updates user level/points
router.post('/modules/:id/complete', verifyToken, async (req, res) => {
  const moduleId = req.params.id;
  const modulePointsMap = {
    m1: 100,
    m2: 200,
    m3: 150
  };

  const pointsToAdd = modulePointsMap[moduleId] || 50;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Add points
    user.points += pointsToAdd;

    // Use geometric progression for next level points
    function totalPointsForLevel(level, basePoints = 500, growth = 1.2) {
      if (level <= 1) return 0;
      return Math.round(basePoints * (1 - Math.pow(growth, level - 1)) / (1 - growth));
    }
    let leveledUp = false;
    while (user.points >= totalPointsForLevel(user.level + 1)) {
      user.level += 1;
      leveledUp = true;
    }

    // Unlock badge (optional logic)
    const alreadyHas = user.badges?.some(b => b.id === moduleId);
    if (!alreadyHas) {
      user.badges.push({
        id: moduleId,
        name: `Module ${moduleId} Terminé`,
        icon: '✅',
        description: `Félicitations ! Vous avez complété le module ${moduleId}.`,
        unlockedAt: new Date()
      });
    }

    await user.save();

    res.json({
      message: 'Module complété avec succès',
      updated: {
        points: user.points,
        level: user.level,
        badges: user.badges
      }
    });
  } catch (err) {
    console.error('Error completing module:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET /leaderboard — dynamic leaderboard data
router.get('/leaderboard', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();

    // Calculate total points, badges count, completed modules count (if available)
    // For now, completedModules is set to 0 as module completion tracking is not in User model
    const leaderboard = users.map(user => ({
      user: {
        id: user._id,
        name: user.email.split('@')[0],
        avatar: `https://i.pravatar.cc/100?u=${user._id}`,
        level: user.level,
        badges: user.badges || []
      },
      totalPoints: user.points || 0,
      completedModules: 0,
      badgeCount: user.badges ? user.badges.length : 0
    }));

    // Sort by totalPoints descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Find current user rank and points needed to reach next ranks
    const currentUserId = req.user.id;
    const currentUserIndex = leaderboard.findIndex(entry => entry.user.id.toString() === currentUserId.toString());

    // Include up to 7th place and current user's rank if not in top 7
    let topUsers = leaderboard.slice(0, 7);
    if (currentUserIndex >= 7) {
      topUsers.push(leaderboard[currentUserIndex]);
    }

    // Calculate points needed to reach next ranks for current user
    if (currentUserIndex !== -1) {
      const currentUserPoints = leaderboard[currentUserIndex].totalPoints;
      topUsers = topUsers.map(entry => {
        if (entry.user.id.toString() === currentUserId.toString()) {
          return Object.assign({}, entry, { pointsToNextRank: 0 });
        }
        if (entry.rank < leaderboard[currentUserIndex].rank) {
          return Object.assign({}, entry, { pointsToNextRank: entry.totalPoints - currentUserPoints + 1 });
        }
        return Object.assign({}, entry, { pointsToNextRank: 0 });
      });
    }

    res.json(topUsers);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
