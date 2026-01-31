import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themes, DEFAULT_THEME_ID } from './themes';

interface ThemeState {
  themeId: string;
  setThemeId: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: DEFAULT_THEME_ID,
      setThemeId: (id: string) => set({ themeId: id }),
    }),
    {
      name: 'affirmations-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useCurrentTheme(): Theme {
  const themeId = useThemeStore((s) => s.themeId);
  return themes.find((t) => t.id === themeId) ?? themes[0];
}
