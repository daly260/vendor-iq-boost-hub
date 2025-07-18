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

const Module = require('../models/Module');
const User = require('../models/User');

// Helper: Award badges based on user progress, quiz, live session, and level
async function checkAndAwardBadges(userId) {
  const user = await User.findById(userId);
  if (!user) return;
  const Progress = require('../models/Progress');
  const progressList = await Progress.find({ userId });
  const completedModules = progressList.filter(p => p.progress >= 100);
  const completedModuleCount = completedModules.length;
  const completedQuiz = progressList.filter(p => p.progress >= 100 && p.quizScore === 100);
  const completedQuizCount = completedQuiz.length;
  const perfectQuizCount = progressList.filter(p => p.quizScore === 100).length;
  const fastQuizCount = progressList.filter(p => p.quizTime && p.quizTime <= 300).length; // 5 min = 300s
  // For live sessions, count unique session IDs in progress with type 'live'
  // For now, assume Collaborateur badge is handled elsewhere or by session registration

  // Premier Pas (id: '1')
  if (completedModuleCount >= 1 && !user.badges.some(b => b.id === '1')) {
    user.badges.push({
      id: '1', name: 'Premier Pas', icon: '🎯', description: 'Complété ton premier module', unlockedAt: new Date()
    });
  }
  // Marathonien (id: '2')
  if (completedModuleCount >= 10 && !user.badges.some(b => b.id === '2')) {
    user.badges.push({
      id: '2', name: 'Marathonien', icon: '🏃‍♀️', description: 'Complété 10 modules', unlockedAt: new Date()
    });
  }
  // Quiz Master (id: '3')
  if (perfectQuizCount >= 5 && !user.badges.some(b => b.id === '3')) {
    user.badges.push({
      id: '3', name: 'Quiz Master', icon: '🧠', description: 'Score parfait sur 5 quiz', unlockedAt: new Date()
    });
  }
  // Perfectionniste (id: '4')
  if (progressList.some(p => p.progress === 100) && !user.badges.some(b => b.id === '4')) {
    user.badges.push({
      id: '4', name: 'Perfectionniste', icon: '⭐', description: 'Complété un module à 100%', unlockedAt: new Date()
    });
  }
  // Rapide comme l'éclair (id: '5')
  if (fastQuizCount >= 1 && !user.badges.some(b => b.id === '5')) {
    user.badges.push({
      id: '5', name: 'Rapide comme l\'éclair', icon: '⚡', description: 'Terminé un quiz en moins de 5 minutes', unlockedAt: new Date()
    });
  }
  // Collaborateur (id: '6') - for demo, count modules of type 'live' completed
  const liveSessionCount = progressList.filter(p => p.type === 'live' && p.progress >= 100).length;
  if (liveSessionCount >= 3 && !user.badges.some(b => b.id === '6')) {
    user.badges.push({
      id: '6', name: 'Collaborateur', icon: '🤝', description: 'Participé à 3 sessions live', unlockedAt: new Date()
    });
  }
  // Expert (id: '7')
  if (user.level >= 10 && !user.badges.some(b => b.id === '7')) {
    user.badges.push({
      id: '7', name: 'Expert', icon: '👑', description: 'Atteint le niveau 10', unlockedAt: new Date()
    });
  }
  // Mentor (id: '8') - custom logic, e.g., user.mentoredCount >= 5
  if (user.mentoredCount >= 5 && !user.badges.some(b => b.id === '8')) {
    user.badges.push({
      id: '8', name: 'Mentor', icon: '🧑‍🏫', description: 'Aidé 5 autres vendeurs', unlockedAt: new Date()
    });
  }
  await user.save();
}

// Update progress for a user and module (add quiz logic)
router.post('/', async (req, res) => {
  try {
    const { userId, moduleId, status, progress, completedAt, lastWatchedTime, quizScore, quizTime, type } = req.body;
    let doc = await Progress.findOne({ userId, moduleId });
    if (doc) {
      doc.status = status || doc.status;
      doc.progress = progress !== undefined ? progress : doc.progress;
      doc.completedAt = completedAt || doc.completedAt;
      if (lastWatchedTime !== undefined) doc.lastWatchedTime = lastWatchedTime;
      if (quizScore !== undefined) doc.quizScore = quizScore;
      if (quizTime !== undefined) doc.quizTime = quizTime;
      if (type) doc.type = type;
      await doc.save();
    } else {
      doc = await Progress.create({ userId, moduleId, status, progress, completedAt, lastWatchedTime, quizScore, quizTime, type });
    }
    // Award badges after progress update
    await checkAndAwardBadges(userId);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// POST /claim-points (award badges after claiming points)
router.post('/claim-points', async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    const progress = await Progress.findOne({ userId, moduleId });
    if (!progress || progress.progress < 100) {
      return res.status(400).json({ error: 'Module not completed yet.' });
    }
    if (progress.pointsClaimed) {
      return res.status(400).json({ error: 'Points already claimed.' });
    }
    const moduleDoc = await Module.findById(moduleId);
    if (!moduleDoc) return res.status(404).json({ error: 'Module not found.' });
    const userDoc = await User.findById(userId);
    if (!userDoc) return res.status(404).json({ error: 'User not found.' });
    userDoc.points = (userDoc.points || 0) + (moduleDoc.points || 0);
    // Use geometric progression for next level points
    function totalPointsForLevel(level, basePoints = 500, growth = 1.2) {
      if (level <= 1) return 0;
      return Math.round(basePoints * (1 - Math.pow(growth, level - 1)) / (1 - growth));
    }
    let leveledUp = false;
    while (userDoc.points >= totalPointsForLevel(userDoc.level + 1)) {
      userDoc.level += 1;
      leveledUp = true;
    }
    await userDoc.save();
    progress.pointsClaimed = true;
    await progress.save();
    // Award badges after claiming points (in case of level up)
    await checkAndAwardBadges(userId);
    res.json({ message: 'Points claimed!', points: userDoc.points });
  } catch (err) {
    res.status(500).json({ error: 'Failed to claim points' });
  }
});

// GET /stats/learning-minutes — average minutes watched per day, week, month
router.get('/stats/learning-minutes', async (req, res) => {
  try {
    // Aggregate total minutes watched per user per progress record
    // Assume lastWatchedTime is in seconds, convert to minutes
    const pipeline = [
      {
        $project: {
          userId: 1,
          minutesWatched: { $divide: ["$lastWatchedTime", 60] },
          createdAt: 1
        }
      }
    ];
    const all = await Progress.aggregate(pipeline);

    // Helper to group by period
    function groupByPeriod(data, getPeriod) {
      const map = {};
      data.forEach(item => {
        const period = getPeriod(item.createdAt);
        if (!map[period]) map[period] = { total: 0, users: new Set() };
        map[period].total += item.minutesWatched;
        map[period].users.add(item.userId);
      });
      // Compute average per user for each period
      return Object.entries(map).map(([period, { total, users }]) => ({
        period,
        average: users.size > 0 ? total / users.size : 0
      })).sort((a, b) => a.period.localeCompare(b.period));
    }

    // Per day
    const perDay = groupByPeriod(all, d => new Date(d).toISOString().slice(0, 10));
    // Per week (ISO week)
    function getISOWeek(date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      const yearStart = new Date(d.getFullYear(),0,1);
      const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
      return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    }
    const perWeek = groupByPeriod(all, d => getISOWeek(d));
    // Per month
    const perMonth = groupByPeriod(all, d => new Date(d).toISOString().slice(0, 7));

    res.json({
      perDay,
      perWeek,
      perMonth
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate learning stats' });
  }
});

module.exports = router;
