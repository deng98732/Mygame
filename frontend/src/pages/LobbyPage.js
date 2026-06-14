import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { roomAPI } from '../services/api';
import { connectSocket } from '../services/socket';
import { LogOut, Plus, Users, Lock, Globe } from 'lucide-react';

const LobbyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { rooms, setRooms, currentRoom } = useGameStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    maxPlayers: 12,
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 连接 Socket
    connectSocket();
    
    // 加载房间列表
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('加载房间失败:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await roomAPI.createRoom(formData);
      setRooms([...rooms, response.data]);
      setFormData({ name: '', maxPlayers: 12, password: '' });
      setShowCreateForm(false);
      navigate(`/game/${response.data._id}`);
    } catch (error) {
      console.error('创建房间失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const response = await roomAPI.joinRoom(roomId);
      navigate(`/game/${roomId}`);
    } catch (error) {
      console.error('加入房间失败:', error);
      alert('加入房间失败: ' + (error.response?.data?.message || '未知错误'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* 顶部导航 */}
      <header className="bg-gradient-to-r from-slate-900 to-purple-900 border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-purple-400">🐺 狼人杀</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">欢迎, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/20 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 创建房间按钮 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-100">游戏房间</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            创建房间
          </button>
        </div>

        {/* 创建房间表单 */}
        {showCreateForm && (
          <div className="card p-6 mb-8 animate-slide-in">
            <h3 className="text-xl font-semibold mb-6 text-slate-100">创建新房间</h3>
            <form onSubmit={handleCreateRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">房间名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="房间名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">最大玩家数</label>
                <select
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                  className="input-field w-full"
                >
                  {[4, 6, 8, 10, 12, 15, 20].map(num => (
                    <option key={num} value={num}>{num} 人</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">房间密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field w-full"
                  placeholder="可选"
                />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 房间列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room._id} className="card p-6 hover:shadow-lg transition hover:scale-105 transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">{room.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{room.players?.length || 0}/{room.maxPlayers} 玩家</span>
                    </div>
                  </div>
                  {room.isPrivate && (
                    <Lock className="w-5 h-5 text-purple-400" />
                  )}
                  {!room.isPrivate && (
                    <Globe className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-xs text-slate-400 mb-2">房主: {room.host?.username}</p>
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                    {room.status === 'waiting' ? '等待中' : room.status === 'playing' ? '游戏中' : '已结束'}
                  </span>
                </div>
                <button
                  onClick={() => handleJoinRoom(room._id)}
                  disabled={room.players?.length >= room.maxPlayers || room.status !== 'waiting'}
                  className="w-full btn-primary py-2"
                >
                  加入房间
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full card p-12 text-center">
              <p className="text-slate-400 text-lg">暂无房间，创建一个新房间开始游戏吧！</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LobbyPage;
