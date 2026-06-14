import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { getSocket } from '../services/socket';
import { roomAPI, gameAPI } from '../services/api';
import { Send, Users, LogOut } from 'lucide-react';

const GamePage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentRoom, setCurrentRoom, currentGame, setCurrentGame, gamePhase, setGamePhase, messages, addMessage } = useGameStore();
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const socket = getSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchRoomData();
  }, [roomId]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('room:join', { roomId, userId: user?.id });
      socket.on('room:player-joined', handlePlayerJoined);
      socket.on('room:player-left', handlePlayerLeft);
      socket.on('game:started', handleGameStarted);
      socket.on('chat:new-message', handleNewMessage);
      socket.on('game:vote-received', handleVoteReceived);
      socket.on('game:phase-update', handlePhaseUpdate);
    }

    return () => {
      if (socket) {
        socket.off('room:player-joined', handlePlayerJoined);
        socket.off('room:player-left', handlePlayerLeft);
        socket.off('game:started', handleGameStarted);
        socket.off('chat:new-message', handleNewMessage);
        socket.off('game:vote-received', handleVoteReceived);
        socket.off('game:phase-update', handlePhaseUpdate);
      }
    };
  }, [socket, roomId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchRoomData = async () => {
    try {
      const response = await roomAPI.getRoom(roomId);
      setCurrentRoom(response.data);
      setLoading(false);
    } catch (error) {
      console.error('加载房间失败:', error);
      navigate('/lobby');
    }
  };

  const handlePlayerJoined = (data) => {
    console.log('玩家加入:', data);
    fetchRoomData();
  };

  const handlePlayerLeft = (data) => {
    console.log('玩家离开:', data);
    fetchRoomData();
  };

  const handleGameStarted = (data) => {
    console.log('游戏开始:', data);
    setCurrentGame(data);
    setGamePhase('day');
  };

  const handleNewMessage = (data) => {
    addMessage(data);
  };

  const handleVoteReceived = (data) => {
    console.log('投票已接收:', data);
  };

  const handlePhaseUpdate = (data) => {
    setGamePhase(data.phase);
  };

  const handleStartGame = async () => {
    if (currentRoom?.host?.id !== user?.id) {
      alert('只有房主可以启动游戏');
      return;
    }
    socket?.emit('game:start', { roomId });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    socket?.emit('chat:message', {
      roomId,
      gameId: currentGame?._id,
      message: chatInput,
      phase: gamePhase
    });
    setChatInput('');
  };

  const handleLeaveRoom = async () => {
    try {
      await roomAPI.leaveRoom(roomId);
      navigate('/lobby');
    } catch (error) {
      console.error('离开房间失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部信息栏 */}
      <header className="bg-gradient-to-r from-slate-900 to-purple-900 border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{currentRoom?.name}</h1>
            <p className="text-sm text-slate-400">游戏状态: <span className="text-purple-400">{currentRoom?.status === 'waiting' ? '等待中' : '进行中'}</span></p>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/20 rounded-lg transition text-red-300"
          >
            <LogOut className="w-4 h-4" />
            离开房间
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        {/* 主游戏区 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 玩家列表 */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              玩家 ({currentRoom?.players?.length || 0}/{currentRoom?.maxPlayers})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentRoom?.players?.map((player) => (
                <div key={player._id} className="bg-slate-800/50 rounded-lg p-3 text-center hover:bg-slate-700/50 transition">
                  <div className="w-10 h-10 rounded-full mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {player.username?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-medium text-slate-200">{player.username}</p>
                  {currentRoom?.host?._id === player._id && (
                    <span className="text-xs text-yellow-400 mt-1">🎮 房主</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 开始游戏按钮 */}
          {currentRoom?.status === 'waiting' && currentRoom?.host?.id === user?.id && (
            <button
              onClick={handleStartGame}
              disabled={!currentRoom?.players || currentRoom?.players?.length < 4}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎮 {currentRoom?.players?.length >= 4 ? '开始游戏' : `需要至少4个玩家 (当前${currentRoom?.players?.length || 0}人)`}
            </button>
          )}

          {/* 游戏状态显示 */}
          {currentGame && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-3">游戏状态</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">当前阶段</p>
                  <p className="text-lg font-bold text-purple-400">
                    {gamePhase === 'day' ? '☀️ 白天'  : gamePhase === 'night' ? '🌙 夜晚' : gamePhase === 'voting' ? '🗳️ 投票' : gamePhase === 'result' ? '📊 结果' : '等待'}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">游戏轮数</p>
                  <p className="text-lg font-bold text-purple-400">{currentGame?.phaseNumber || 1}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 聊天区 */}
        <div className="card flex flex-col h-96 lg:h-full">
          <h2 className="text-xl font-bold text-slate-100 mb-4 p-4 border-b border-slate-700">聊天</h2>
          
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className="text-sm">
                <p className="text-purple-400 font-medium text-xs mb-1">{msg.userId} <span className="text-slate-500">{new Date(msg.timestamp).toLocaleTimeString()}</span></p>
                <p className="text-slate-300">{msg.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 消息输入框 */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-700 p-4 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="input-field flex-1 text-sm"
              placeholder="输入消息..."
              disabled={!currentGame}
            />
            <button
              type="submit"
              disabled={!currentGame || !chatInput.trim()}
              className="btn-primary px-3 py-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
