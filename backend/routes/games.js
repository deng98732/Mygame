const express = require('express');
const Game = require('../models/Game');
const Room = require('../models/Room');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取游戏历史
router.get('/history/:userId', async (req, res) => {
  try {
    const games = await Game.find({
      'players.user': req.params.userId
    }).populate('room', 'name').limit(20);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: '获取游戏历史失败' });
  }
});

// 获取游戏详情
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('room', 'name')
      .populate('players.user', 'username avatar');
    
    if (!game) {
      return res.status(404).json({ message: '游戏不存在' });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: '获取游戏信息失败' });
  }
});

module.exports = router;
