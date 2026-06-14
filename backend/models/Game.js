const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['werewolf', 'villager', 'seer', 'doctor', 'hunter'],
      default: 'villager'
    },
    isAlive: {
      type: Boolean,
      default: true
    },
    votedFor: mongoose.Schema.Types.ObjectId,
    voteCount: { type: Number, default: 0 }
  }],
  phase: {
    type: String,
    enum: ['day', 'night', 'voting', 'result', 'game-over'],
    default: 'day'
  },
  phaseNumber: {
    type: Number,
    default: 1
  },
  winner: {
    type: String,
    enum: ['villagers', 'werewolves', 'none'],
    default: 'none'
  },
  chatHistory: [{
    user: mongoose.Schema.Types.ObjectId,
    message: String,
    timestamp: Date,
    phase: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Game', gameSchema);
