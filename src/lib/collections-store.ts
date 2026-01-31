import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedAffirmation {
  id: string;
  text: string;
  category?: string;
  savedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
  affirmations: SavedAffirmation[];
}

interface CollectionsState {
  collections: Collection[];
  createCollection: (name: string, icon: string, color: string) => string;
  deleteCollection: (collectionId: string) => void;
  renameCollection: (collectionId: string, newName: string) => void;
  addAffirmationToCollection: (collectionId: string, affirmation: Omit<SavedAffirmation, 'id' | 'savedAt'>) => void;
  removeAffirmationFromCollection: (collectionId: string, affirmationId: string) => void;
  isAffirmationInCollection: (collectionId: string, text: string) => boolean;
  isAffirmationInAnyCollection: (text: string) => boolean;
  getCollectionsForAffirmation: (text: string) => Collection[];
}

// Generar ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Colores predefinidos para colecciones
export const COLLECTION_COLORS = [
  '#FF6B6B', // Coral
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage
  '#FFEAA7', // Butter
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Sunflower
  '#BB8FCE', // Lavender
  '#85C1E9', // Light Blue
];

// Iconos predefinidos para colecciones
export const COLLECTION_ICONS = [
  '💫', '✨', '🌟', '💎', '🦋', '🌸', '🌺', '🍀', '🌈', '💜',
  '💙', '💚', '💛', '🧡', '❤️', '🤍', '🖤', '💝', '🎯', '🔮',
];

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      collections: [],

      createCollection: (name, icon, color) => {
        const id = generateId();
        const newCollection: Collection = {
          id,
          name,
          icon,
          color,
          createdAt: Date.now(),
          affirmations: [],
        };
        set((state) => ({
          collections: [...state.collections, newCollection],
        }));
        return id;
      },

      deleteCollection: (collectionId) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== collectionId),
        }));
      },

      renameCollection: (collectionId, newName) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId ? { ...c, name: newName } : c
          ),
        }));
      },

      addAffirmationToCollection: (collectionId, affirmation) => {
        const state = get();
        const collection = state.collections.find((c) => c.id === collectionId);

        // Verificar si ya existe en esta colección
        if (collection?.affirmations.some((a) => a.text === affirmation.text)) {
          return;
        }

        const newAffirmation: SavedAffirmation = {
          id: generateId(),
          text: affirmation.text,
          category: affirmation.category,
          savedAt: Date.now(),
        };

        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, affirmations: [...c.affirmations, newAffirmation] }
              : c
          ),
        }));
      },

      removeAffirmationFromCollection: (collectionId, affirmationId) => {
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, affirmations: c.affirmations.filter((a) => a.id !== affirmationId) }
              : c
          ),
        }));
      },

      isAffirmationInCollection: (collectionId, text) => {
        const state = get();
        const collection = state.collections.find((c) => c.id === collectionId);
        return collection?.affirmations.some((a) => a.text === text) ?? false;
      },

      isAffirmationInAnyCollection: (text) => {
        const state = get();
        return state.collections.some((c) => c.affirmations.some((a) => a.text === text));
      },

      getCollectionsForAffirmation: (text) => {
        const state = get();
        return state.collections.filter((c) => c.affirmations.some((a) => a.text === text));
      },
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
