import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Background images available - these are pre-loaded at app start in preloadCategoryImages.ts
export const backgroundImages = [
  {
    id: 'fantasy-landscape',
    name: 'Fantasy',
    image: require('@/assets/images/fantasy-landscape.jpg'),
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora',
    image: require('@/assets/images/aurora-borealis.jpg'),
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    image: require('@/assets/images/cherry-blossom.jpg'),
  },
  {
    id: 'tropical-beach',
    name: 'Tropical Beach',
    image: require('@/assets/images/tropical-beach.jpg'),
  },
  {
    id: 'crystal-water',
    name: 'Crystal Water',
    image: require('@/assets/images/crystal-water.jpg'),
  },
  {
    id: 'pink-beach',
    name: 'Pink Beach',
    image: require('@/assets/images/pink-beach.jpg'),
  },
  {
    id: 'cherry-baby',
    name: 'Cherry Baby',
    image: require('@/assets/images/cherry-baby.jpg'),
  },
] as const;

export type BackgroundImageId = typeof backgroundImages[number]['id'] | null;

interface BackgroundState {
  backgroundImageId: string | null;
  setBackgroundImageId: (id: string | null) => void;
}

export const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      backgroundImageId: null,
      setBackgroundImageId: (id: string | null) => set({ backgroundImageId: id }),
    }),
    {
      name: 'affirmations-background',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useCurrentBackground() {
  const backgroundImageId = useBackgroundStore((s) => s.backgroundImageId);
  if (!backgroundImageId) return null;
  return backgroundImages.find((bg) => bg.id === backgroundImageId) ?? null;
}
