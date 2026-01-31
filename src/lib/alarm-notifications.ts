import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAlarmStore, DayOfWeek } from './alarm-store';
import { playNotificationSound } from './sounds';

// Check if we're on a native platform
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

// Configure notification handler for iOS - must be called before any notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Alarm messages
const ALARM_MESSAGES = [
  '¡Buenos días! Es hora de tus afirmaciones ✨',
  '¡Despierta tu mejor versión! Momento de afirmaciones 🌟',
  '¡Tu momento sagrado te espera! 🙏',
  '¡Empieza el día con pensamientos positivos! ☀️',
  '¡Es hora de tu práctica diaria de afirmaciones! 💫',
];

// Get a random alarm message
function getRandomMessage(): string {
  return ALARM_MESSAGES[Math.floor(Math.random() * ALARM_MESSAGES.length)];
}

// Convert day of week to JS weekday (1 = Sunday, 2 = Monday, etc.)
function dayToWeekday(day: DayOfWeek): number {
  const mapping: Record<DayOfWeek, number> = {
    sun: 1,
    mon: 2,
    tue: 3,
    wed: 4,
    thu: 5,
    fri: 6,
    sat: 7,
  };
  return mapping[day];
}

// Request notification permissions for iOS
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!isNative) {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('[Alarm] Current permission status:', existingStatus);

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowCriticalAlerts: true,
      },
    });

    console.log('[Alarm] New permission status:', status);
    return status === 'granted';
  } catch (error) {
    console.error('[Alarm] Permission request failed:', error);
    return false;
  }
}

// Schedule alarm notifications
export async function scheduleAlarm(): Promise<void> {
  if (!isNative) {
    console.log('[Alarm] Skipping - not on native platform');
    return;
  }

  try {
    const config = useAlarmStore.getState().config;

    // Cancel all existing alarm notifications first
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'alarm') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    console.log('[Alarm] Cancelled existing alarm notifications');

    if (!config.enabled || config.activeDays.length === 0) {
      console.log('[Alarm] Disabled or no active days');
      return;
    }

    const [hour, minute] = config.time.split(':').map(Number);
    console.log(`[Alarm] Scheduling alarm for ${hour}:${minute}`);
    console.log('[Alarm] Active days:', config.activeDays);

    // Schedule for each active day
    let scheduledCount = 0;
    for (const day of config.activeDays) {
      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏰ Alarma de Afirmaciones',
            body: getRandomMessage(),
            sound: true,
            badge: 1,
            data: { type: 'alarm' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: dayToWeekday(day),
            hour,
            minute,
          },
        });
        scheduledCount++;
        console.log(`[Alarm] Scheduled for ${day} at ${hour}:${minute}, ID: ${id}`);
      } catch (error) {
        console.error(`[Alarm] Failed to schedule for ${day}:`, error);
      }
    }

    console.log(`[Alarm] Total scheduled: ${scheduledCount}`);

    // Verify scheduled notifications
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`[Alarm] Total notifications in system: ${allScheduled.length}`);
  } catch (error) {
    console.error('[Alarm] Schedule failed:', error);
  }
}

// Send a test alarm immediately - this is the key function for testing
export async function sendTestAlarm(): Promise<boolean> {
  if (!isNative) {
    console.log('[Alarm] Not on native platform');
    return false;
  }

  try {
    // First ensure we have permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('[Alarm] No permission for test alarm');
      return false;
    }

    // Get the selected sound
    const config = useAlarmStore.getState().config;
    const soundId = config.soundId || 'default';

    console.log('[Alarm] Sending immediate test alarm with sound:', soundId);

    // Play the sound immediately
    playNotificationSound(soundId);

    // Send notification immediately with null trigger
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Alarma de Afirmaciones',
        body: getRandomMessage(),
        sound: true,
        badge: 1,
        data: { type: 'alarm-test' },
      },
      trigger: null, // null = immediate delivery
    });

    console.log('[Alarm] Test alarm sent with ID:', id);
    return true;
  } catch (error) {
    console.error('[Alarm] Test alarm failed:', error);
    return false;
  }
}

// Initialize alarm listener for store changes
let unsubscribe: (() => void) | null = null;
let alarmReceivedSubscription: Notifications.Subscription | null = null;
let alarmResponseSubscription: Notifications.Subscription | null = null;

export function initAlarmListener(): void {
  if (!isNative) {
    return;
  }

  if (unsubscribe) {
    return;
  }

  // Request permissions on init
  requestNotificationPermissions();

  // Listen for alarm notifications when app is in foreground - play custom sound
  alarmReceivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      const data = notification.request.content.data;
      console.log('[Alarm] Received notification:', data?.type);
      if (data?.type === 'alarm' || data?.type === 'alarm-test') {
        // Always play the selected sound
        const config = useAlarmStore.getState().config;
        const soundId = config.soundId || 'default';
        console.log('[Alarm] Playing sound:', soundId);
        playNotificationSound(soundId);
      }
    }
  );

  // Listen for notification responses (when user taps notification)
  alarmResponseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      console.log('[Alarm] User tapped notification:', data?.type);
    }
  );

  unsubscribe = useAlarmStore.subscribe((state, prevState) => {
    if (JSON.stringify(state.config) !== JSON.stringify(prevState.config)) {
      console.log('[Alarm] Config changed, rescheduling...');
      scheduleAlarm();
    }
  });
}

export function cleanupAlarmListener(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  if (alarmReceivedSubscription) {
    alarmReceivedSubscription.remove();
    alarmReceivedSubscription = null;
  }
  if (alarmResponseSubscription) {
    alarmResponseSubscription.remove();
    alarmResponseSubscription = null;
  }
}
