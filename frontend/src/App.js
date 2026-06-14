import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/lobby" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/lobby" /> : <RegisterPage />} />

          {/* 受保护的路由 */}
          <Route path="/lobby" element={isAuthenticated ? <LobbyPage /> : <Navigate to="/login" />} />
          <Route path="/game/:roomId" element={isAuthenticated ? <GamePage /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />

          {/* 默认路由 */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/lobby" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
