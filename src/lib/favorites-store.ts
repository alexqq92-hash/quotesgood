import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (id: string) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds
            : [...state.favoriteIds, id],
        })),
      removeFavorite: (id: string) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((fid) => fid !== id),
        })),
      toggleFavorite: (id: string) => {
        const state = get();
        if (state.favoriteIds.includes(id)) {
          state.removeFavorite(id);
        } else {
          state.addFavorite(id);
        }
      },
      isFavorite: (id: string) => get().favoriteIds.includes(id),
    }),
    {
      name: 'affirmations-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
