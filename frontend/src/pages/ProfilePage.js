import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI, gameAPI } from '../services/api';
import { ArrowLeft, Trophy, Target } from 'lucide-react';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const profileResponse = await userAPI.getUser(userId);
      setProfile(profileResponse.data);
      
      const historyResponse = await gameAPI.getGameHistory(userId);
      setGameHistory(historyResponse.data);
    } catch (error) {
      console.error('加载用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">加载中...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">用户不存在</p>
      </div>
    );
  }

  const winRate = profile.stats?.totalGames > 0 
    ? ((profile.stats.wins / profile.stats.totalGames) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen animate-fade-in">
      {/* 顶部导航 */}
      <header className="bg-gradient-to-r from-slate-900 to-purple-900 border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
      </header>

      {/* 用户资料 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-8 mb-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl font-bold text-white">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-100 mb-2">{profile.username}</h1>
              <p className="text-slate-400 mb-4">{profile.email}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-slate-300">注册时间: {new Date(profile.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">总游戏场次</p>
              <p className="text-3xl font-bold text-purple-400">{profile.stats?.totalGames || 0}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">胜利次数</p>
              <p className="text-3xl font-bold text-green-400 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                {profile.stats?.wins || 0}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">失败次数</p>
              <p className="text-3xl font-bold text-red-400">{profile.stats?.losses || 0}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">胜率</p>
              <p className="text-3xl font-bold text-yellow-400">{winRate}%</p>
            </div>
          </div>
        </div>

        {/* 游戏历史 */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6" />
            游戏历史
          </h2>
          {gameHistory.length > 0 ? (
            <div className="space-y-4">
              {gameHistory.map((game) => (
                <div key={game._id} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200">{game.room?.name}</p>
                    <p className="text-sm text-slate-400">轮数: {game.phaseNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      game.winner === 'villagers' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {game.winner === 'villagers' ? '村民胜' : game.winner === 'werewolves' ? '狼人胜' : '未知'}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(game.createdAt).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400">暂无游戏历史</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
