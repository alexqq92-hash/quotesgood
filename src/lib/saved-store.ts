import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedState {
  savedIds: string[];
  hasUnlockedSaved: boolean;
  addSaved: (id: string) => void;
  removeSaved: (id: string) => void;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      hasUnlockedSaved: false,
      addSaved: (id: string) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds
            : [...state.savedIds, id],
          hasUnlockedSaved: true,
        })),
      removeSaved: (id: string) =>
        set((state) => ({
          savedIds: state.savedIds.filter((sid) => sid !== id),
        })),
      toggleSaved: (id: string) => {
        const state = get();
        if (state.savedIds.includes(id)) {
          state.removeSaved(id);
        } else {
          state.addSaved(id);
        }
      },
      isSaved: (id: string) => get().savedIds.includes(id),
    }),
    {
      name: 'affirmations-saved',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
