import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface AlarmConfig {
  enabled: boolean;
  time: string; // Format: "HH:MM" (24h)
  activeDays: DayOfWeek[];
  soundId: string; // ID del sonido seleccionado
}

interface AlarmState {
  config: AlarmConfig;
  setEnabled: (enabled: boolean) => void;
  setTime: (time: string) => void;
  toggleDay: (day: DayOfWeek) => void;
  setActiveDays: (days: DayOfWeek[]) => void;
  setSoundId: (soundId: string) => void;
}

const DEFAULT_CONFIG: AlarmConfig = {
  enabled: false,
  time: '07:00',
  activeDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  soundId: 'harp-gentle',
};

export const useAlarmStore = create<AlarmState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setEnabled: (enabled) =>
        set((state) => ({ config: { ...state.config, enabled } })),
      setTime: (time) =>
        set((state) => ({ config: { ...state.config, time } })),
      toggleDay: (day) =>
        set((state) => {
          const activeDays = state.config.activeDays.includes(day)
            ? state.config.activeDays.filter((d) => d !== day)
            : [...state.config.activeDays, day];
          return { config: { ...state.config, activeDays } };
        }),
      setActiveDays: (activeDays) =>
        set((state) => ({ config: { ...state.config, activeDays } })),
      setSoundId: (soundId) =>
        set((state) => ({ config: { ...state.config, soundId } })),
    }),
    {
      name: 'affirmations-alarm',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper to format time for display
export function formatTimeDisplay(time: string): string {
  const [hour, min] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
}

// Day labels in Spanish
export const DAY_LABELS: Record<DayOfWeek, { short: string; full: string }> = {
  mon: { short: 'L', full: 'Lunes' },
  tue: { short: 'M', full: 'Martes' },
  wed: { short: 'X', full: 'Miércoles' },
  thu: { short: 'J', full: 'Jueves' },
  fri: { short: 'V', full: 'Viernes' },
  sat: { short: 'S', full: 'Sábado' },
  sun: { short: 'D', full: 'Domingo' },
};

export const DAYS_ORDER: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
