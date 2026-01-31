import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MyAffirmation {
  id: string;
  text: string;
  createdAt: number;
}

interface MyAffirmationsState {
  affirmations: MyAffirmation[];
  addAffirmation: (text: string) => string;
  deleteAffirmation: (id: string) => void;
  editAffirmation: (id: string, newText: string) => void;
}

// Generar ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const useMyAffirmationsStore = create<MyAffirmationsState>()(
  persist(
    (set) => ({
      affirmations: [],

      addAffirmation: (text) => {
        const id = generateId();
        const newAffirmation: MyAffirmation = {
          id,
          text: text.trim(),
          createdAt: Date.now(),
        };
        set((state) => ({
          affirmations: [newAffirmation, ...state.affirmations],
        }));
        return id;
      },

      deleteAffirmation: (id) => {
        set((state) => ({
          affirmations: state.affirmations.filter((a) => a.id !== id),
        }));
      },

      editAffirmation: (id, newText) => {
        set((state) => ({
          affirmations: state.affirmations.map((a) =>
            a.id === id ? { ...a, text: newText.trim() } : a
          ),
        }));
      },
    }),
    {
      name: 'my-affirmations-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
