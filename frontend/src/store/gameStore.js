import { create } from 'zustand';

export const useGameStore = create((set) => ({
  rooms: [],
  currentRoom: null,
  currentGame: null,
  players: [],
  gamePhase: 'waiting', // waiting, day, night, voting, result
  messages: [],

  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setCurrentGame: (game) => set({ currentGame: game }),
  setPlayers: (players) => set({ players }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] })
}));
