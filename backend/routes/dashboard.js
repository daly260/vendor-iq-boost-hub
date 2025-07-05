const express = require('express');
const verifyToken = require('../middleware/verifyToken.js');
const User = require('../models/User.js');

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

// ✅ GET /modules — sample data
router.get('/modules', verifyToken, (req, res) => {
  res.json([
    {
      id: 'm1',
      title: 'Introduction à la vente',
      description: 'Les bases pour démarrer',
      type: 'video',
      points: 100,
      duration: 15,
      progress: 100,
      completed: true
    },
    {
      id: 'm2',
      title: 'Techniques avancées',
      description: 'Devenez un pro',
      type: 'guide',
      points: 200,
      duration: 30,
      progress: 60,
      completed: false
    },
    {
      id: 'm3',
      title: 'Quiz sur la vente',
      description: 'Testez vos connaissances',
      type: 'quiz',
      points: 150,
      duration: 10,
      progress: 30,
      completed: false
    }
  ]);
});

// ✅ GET /live-sessions — static
router.get('/live-sessions', verifyToken, (req, res) => {
  res.json([
    {
      id: 'ls1',
      title: 'Session Live: Boostez vos ventes',
      description: 'Une session interactive pour apprendre ensemble',
      date: '2025-07-01',
      time: '18:00',
      registeredCount: 5,
      maxParticipants: 20,
      isRegistered: true
    }
  ]);
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

    // Level up
    const nextLevelPoints = (user.level + 1) * 500;
    if (user.points >= nextLevelPoints) {
      user.level += 1;
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
