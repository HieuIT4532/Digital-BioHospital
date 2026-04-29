const express = require('express');
const router = express.Router();
const { db } = require('../utils/firebaseAdmin');

// GET /api/leaderboard — Top users theo EXP
router.get('/', async (req, res) => {
  try {
    const maxResults = parseInt(req.query.limit) || 10;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.orderBy('exp', 'desc').limit(maxResults).get();

    const leaders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      leaders.push({
        uid: doc.id,
        displayName: data.displayName || 'Ẩn danh',
        photoURL: data.photoURL || null,
        exp: data.exp || 0,
        streak: data.streak || 0,
        activeDays: data.activeDays || 0,
        rank: data.rank || 'intern',
        totalDiagnoses: data.totalDiagnoses || 0,
        checkInHistory: (data.checkInHistory || []).slice(-90) // Chỉ trả 90 ngày gần nhất
      });
    });

    res.json({
      success: true,
      leaderboard: leaders,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('GET /leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
