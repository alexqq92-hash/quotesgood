import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface RemindersConfig {
  enabled: boolean;
  startTime: string; // Format: "HH:MM" (24h)
  endTime: string; // Format: "HH:MM" (24h)
  frequency: number; // Number of reminders per day (1-12)
  activeDays: DayOfWeek[];
  soundId: string; // ID del sonido seleccionado
}

interface RemindersState {
  config: RemindersConfig;
  setEnabled: (enabled: boolean) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setFrequency: (frequency: number) => void;
  toggleDay: (day: DayOfWeek) => void;
  setActiveDays: (days: DayOfWeek[]) => void;
  setSoundId: (soundId: string) => void;
}

const DEFAULT_CONFIG: RemindersConfig = {
  enabled: false,
  startTime: '08:00',
  endTime: '21:00',
  frequency: 5,
  activeDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  soundId: 'harp-gentle',
};

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      setEnabled: (enabled) =>
        set((state) => ({ config: { ...state.config, enabled } })),
      setStartTime: (startTime) =>
        set((state) => ({ config: { ...state.config, startTime } })),
      setEndTime: (endTime) =>
        set((state) => ({ config: { ...state.config, endTime } })),
      setFrequency: (frequency) =>
        set((state) => ({ config: { ...state.config, frequency } })),
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
      name: 'affirmations-reminders',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper to calculate scheduled notification times
export function calculateNotificationTimes(config: RemindersConfig): string[] {
  if (!config.enabled || config.activeDays.length === 0) {
    return [];
  }

  const [startHour, startMin] = config.startTime.split(':').map(Number);
  const [endHour, endMin] = config.endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Handle case where end time is before start time (overnight)
  const totalMinutes =
    endMinutes > startMinutes
      ? endMinutes - startMinutes
      : 24 * 60 - startMinutes + endMinutes;

  const times: string[] = [];
  const interval = totalMinutes / config.frequency;

  for (let i = 0; i < config.frequency; i++) {
    const minutesFromStart = Math.round(i * interval);
    let totalMins = startMinutes + minutesFromStart;
    if (totalMins >= 24 * 60) {
      totalMins -= 24 * 60;
    }
    const hour = Math.floor(totalMins / 60);
    const min = totalMins % 60;
    times.push(
      `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    );
  }

  return times;
}

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
