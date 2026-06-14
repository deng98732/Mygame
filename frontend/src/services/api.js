import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const authAPI = {
  login: (email, password) => axios.post(`${API_URL}/auth/login`, { email, password }),
  register: (username, email, password) => axios.post(`${API_URL}/auth/register`, { username, email, password })
};

export const userAPI = {
  getUser: (id) => axios.get(`${API_URL}/users/${id}`),
  updateUser: (id, data) => axios.put(`${API_URL}/users/${id}`, data, getAuthHeader()),
  getLeaderboard: () => axios.get(`${API_URL}/users/leaderboard/top`)
};

export const roomAPI = {
  getRooms: () => axios.get(`${API_URL}/rooms`),
  getRoom: (id) => axios.get(`${API_URL}/rooms/${id}`),
  createRoom: (data) => axios.post(`${API_URL}/rooms`, data, getAuthHeader()),
  joinRoom: (id) => axios.post(`${API_URL}/rooms/${id}/join`, {}, getAuthHeader()),
  leaveRoom: (id) => axios.post(`${API_URL}/rooms/${id}/leave`, {}, getAuthHeader())
};

export const gameAPI = {
  getGameHistory: (userId) => axios.get(`${API_URL}/games/history/${userId}`),
  getGame: (id) => axios.get(`${API_URL}/games/${id}`)
};
