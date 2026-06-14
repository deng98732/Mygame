const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取所有房间
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'waiting' })
      .populate('host', 'username avatar')
      .populate('players', 'username avatar');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: '获取房间列表失败' });
  }
});

// 创建房间
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, maxPlayers, password } = req.body;
    
    const room = new Room({
      name,
      host: req.user.id,
      maxPlayers,
      password: password || null,
      isPrivate: !!password,
      players: [req.user.id]
    });
    
    await room.save();
    await room.populate('host', 'username avatar');
    
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: '创建房间失败' });
  }
});

// 获取房间详情
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('host', 'username avatar')
      .populate('players', 'username avatar');
    
    if (!room) {
      return res.status(404).json({ message: '房间不存在' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: '获取房间信息失败' });
  }
});

// 加入房间
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: '房间不存在' });
    }
    
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: '房间已满' });
    }
    
    if (room.players.includes(req.user.id)) {
      return res.status(400).json({ message: '你已在房间中' });
    }
    
    room.players.push(req.user.id);
    await room.save();
    await room.populate('host', 'username avatar');
    await room.populate('players', 'username avatar');
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: '加入房间失败' });
  }
});

// 离开房间
router.post('/:id/leave', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: '房间不存在' });
    }
    
    room.players = room.players.filter(id => id.toString() !== req.user.id);
    
    if (room.players.length === 0) {
      await Room.findByIdAndDelete(req.params.id);
      return res.json({ message: '房间已删除' });
    }
    
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: '离开房间失败' });
  }
});

module.exports = router;
