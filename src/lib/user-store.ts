import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  userName: string;
  setUserName: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: '',
      setUserName: (name: string) => set({ userName: name }),
    }),
    {
      name: 'user-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
