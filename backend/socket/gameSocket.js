const Game = require('../models/Game');
const Room = require('../models/Room');
const User = require('../models/User');
const { assignRoles, checkWinCondition } = require('../utils/gameLogic');

module.exports = (io) => {
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log(`玩家连接: ${socket.id}`);

    // 用户登录
    socket.on('user:login', (userId) => {
      userSockets.set(userId, socket.id);
      socket.userId = userId;
    });

    // 加入房间
    socket.on('room:join', async (data) => {
      const { roomId, userId } = data;
      socket.join(`room:${roomId}`);
      io.to(`room:${roomId}`).emit('room:player-joined', { userId });
    });

    // 离开房间
    socket.on('room:leave', async (data) => {
      const { roomId, userId } = data;
      socket.leave(`room:${roomId}`);
      io.to(`room:${roomId}`).emit('room:player-left', { userId });
    });

    // 开始游戏
    socket.on('game:start', async (data) => {
      const { roomId } = data;
      try {
        const room = await Room.findById(roomId).populate('players');
        if (room.players.length < 4) {
          socket.emit('game:error', '玩家数量不足');
          return;
        }

        // 创建游戏
        const game = new Game({
          room: roomId,
          players: room.players.map(player => ({
            user: player._id,
            role: 'villager'
          }))
        });

        // 分配角色
        assignRoles(game);
        await game.save();

        // 更新房间状态
        room.status = 'playing';
        room.currentGame = game._id;
        await room.save();

        io.to(`room:${roomId}`).emit('game:started', {
          gameId: game._id,
          players: game.players.map(p => ({ user: p.user, role: p.role }))
        });
      } catch (error) {
        socket.emit('game:error', '启动游戏失败');
      }
    });

    // 发送聊天消息
    socket.on('chat:message', async (data) => {
      const { roomId, gameId, message, phase } = data;
      io.to(`room:${roomId}`).emit('chat:new-message', {
        userId: socket.userId,
        message,
        phase,
        timestamp: new Date()
      });
    });

    // 投票
    socket.on('game:vote', async (data) => {
      const { gameId, voterId, votedForId } = data;
      try {
        const game = await Game.findById(gameId);
        const voter = game.players.find(p => p.user.toString() === voterId);
        if (voter) {
          voter.votedFor = votedForId;
        }
        await game.save();
        io.to(`game:${gameId}`).emit('game:vote-received', { voterId });
      } catch (error) {
        socket.emit('game:error', '投票失败');
      }
    });

    // 断开连接
    socket.on('disconnect', () => {
      userSockets.delete(socket.userId);
      console.log(`玩家断开连接: ${socket.id}`);
    });
  });
};
