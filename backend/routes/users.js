const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取用户信息
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, avatar, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '更新用户信息失败' });
  }
});

// 获取排行榜
router.get('/leaderboard/top', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ 'stats.wins': -1 })
      .limit(50)
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取排行榜失败' });
  }
});

module.exports = router;
