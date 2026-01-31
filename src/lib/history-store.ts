import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryEntry {
  affirmationId: string;
  viewedAt: number; // timestamp
}

interface HistoryState {
  history: HistoryEntry[];
  addToHistory: (affirmationId: string) => void;
  clearHistory: () => void;
  getRecentHistory: (limit?: number) => HistoryEntry[];
}

const MAX_HISTORY_ITEMS = 500; // Limit history to prevent storage bloat

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (affirmationId: string) =>
        set((state) => {
          const newEntry: HistoryEntry = {
            affirmationId,
            viewedAt: Date.now(),
          };
          // Add to beginning and limit size
          const newHistory = [newEntry, ...state.history].slice(0, MAX_HISTORY_ITEMS);
          return { history: newHistory };
        }),
      clearHistory: () => set({ history: [] }),
      getRecentHistory: (limit = 50) => {
        return get().history.slice(0, limit);
      },
    }),
    {
      name: 'affirmations-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
