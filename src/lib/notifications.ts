import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useRemindersStore, calculateNotificationTimes, DayOfWeek } from './reminders-store';
import { playNotificationSound, getSoundById } from './sounds';

// Check if we're on a native platform (notifications only work on iOS/Android)
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

// Sample affirmations for notifications
const NOTIFICATION_AFFIRMATIONS = [
  'Soy digno de amor y respeto tal como soy',
  'Hoy elijo la alegría y la gratitud',
  'Soy suficiente, tal como soy, ahora mismo',
  'Abrazo mi singularidad y celebro quien soy',
  'Atraigo abundancia en todas las áreas de mi vida',
  'Estoy agradecido por este hermoso día',
  'Irradio energía positiva y atraigo positividad',
  'Confío en el viaje de mi vida',
  'Soy capaz de alcanzar mis sueños',
  'Elijo la paz sobre la preocupación',
  'Merezco todas las cosas buenas que me llegan',
  'Mi valor propio no está determinado por las opiniones de otros',
  'Elijo ser amable conmigo mismo hoy y todos los días',
  'Estoy orgulloso de quien me estoy convirtiendo',
  'Libero la necesidad de ser perfecto y abrazo ser real',
  'Merezco felicidad y paz',
  'Confío en mí mismo para tomar las decisiones correctas',
  'Soy hermoso por dentro y por fuera',
  'Mis imperfecciones me hacen único y especial',
  'Me doy permiso para descansar y recargar energías',
];

// Configure notification handler (only on native)
if (isNative) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// Setup Android notification channel
async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('affirmations', {
      name: 'Afirmaciones Diarias',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B6B',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
    });
  }
}

// Get a random affirmation
function getRandomAffirmation(): string {
  return NOTIFICATION_AFFIRMATIONS[
    Math.floor(Math.random() * NOTIFICATION_AFFIRMATIONS.length)
  ];
}

// Convert day of week to JS weekday (1 = Sunday, 2 = Monday, etc. for expo-notifications)
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

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!isNative) {
    return false;
  }

  // Setup Android channel first
  if (Platform.OS === 'android') {
    await setupAndroidChannel();
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log('[Notifications] Current permission status:', existingStatus);

  if (existingStatus === 'granted') {
    return true;
  }

  // Request permissions with iOS-specific options
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  console.log('[Notifications] New permission status:', status);
  return status === 'granted';
}

// Schedule all notifications based on current config
export async function scheduleNotifications(): Promise<void> {
  // Only run on native platforms
  if (!isNative) {
    console.log('[Notifications] Skipping - not on native platform');
    return;
  }

  const config = useRemindersStore.getState().config;

  // Cancel all existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('[Notifications] Cancelled all existing notifications');

  if (!config.enabled || config.activeDays.length === 0) {
    console.log('[Notifications] Disabled or no active days');
    return;
  }

  // Ensure Android channel exists
  if (Platform.OS === 'android') {
    await setupAndroidChannel();
  }

  // Calculate notification times
  const times = calculateNotificationTimes(config);
  console.log('[Notifications] Scheduling for times:', times);
  console.log('[Notifications] Active days:', config.activeDays);

  // Schedule notifications for each active day and time
  let scheduledCount = 0;
  for (const day of config.activeDays) {
    for (const time of times) {
      const [hour, minute] = time.split(':').map(Number);

      try {
        const trigger: Notifications.NotificationTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: dayToWeekday(day),
          hour,
          minute,
        };

        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: '✨ Afirmación del día',
            body: getRandomAffirmation(),
            sound: true,
            data: { type: 'affirmation' },
            ...(Platform.OS === 'android' && { channelId: 'affirmations' }),
          },
          trigger,
        });
        scheduledCount++;
        console.log(`[Notifications] Scheduled: ${day} at ${hour}:${minute}, ID: ${id}`);
      } catch (error) {
        console.error(`[Notifications] Failed to schedule ${day} at ${time}:`, error);
      }
    }
  }

  console.log(`[Notifications] Total scheduled: ${scheduledCount}`);

  // Log all scheduled notifications for debugging
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`[Notifications] Verified scheduled count: ${scheduled.length}`);
}

// Send a test notification immediately
export async function sendTestNotification(): Promise<boolean> {
  if (!isNative) {
    console.log('[Notifications] Not on native platform');
    return false;
  }

  try {
    // Ensure permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('[Notifications] No permission for test notification');
      return false;
    }

    // Get the selected sound
    const config = useRemindersStore.getState().config;
    const soundId = config.soundId || 'default';

    console.log('[Notifications] Sending immediate test notification with sound:', soundId);

    // Play the sound immediately (notification listener will also trigger but this ensures it plays)
    playNotificationSound(soundId);

    // Use null trigger for immediate notification (works better on iOS)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Afirmación del día',
        body: getRandomAffirmation(),
        sound: true,
        data: { type: 'affirmation-test' },
        ...(Platform.OS === 'android' && { channelId: 'affirmations' }),
      },
      trigger: null, // Immediate notification
    });

    console.log('[Notifications] Test notification sent immediately');
    return true;
  } catch (error) {
    console.error('[Notifications] Test notification failed:', error);
    return false;
  }
}

// Cancel all scheduled notifications
export async function cancelAllNotifications(): Promise<void> {
  if (!isNative) {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications() {
  if (!isNative) {
    return [];
  }
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Subscribe to store changes and reschedule notifications
let unsubscribe: (() => void) | null = null;
let notificationReceivedSubscription: Notifications.Subscription | null = null;
let notificationResponseSubscription: Notifications.Subscription | null = null;

export function initNotificationListener(): void {
  // Only set up listener on native platforms
  if (!isNative) {
    return;
  }

  // Only set up listener once
  if (unsubscribe) {
    return;
  }

  // Setup Android channel on init
  if (Platform.OS === 'android') {
    setupAndroidChannel();
  }

  // Listen for notifications when app is in foreground - play custom sound
  notificationReceivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      const data = notification.request.content.data;
      console.log('[Notifications] Received notification:', data?.type);
      if (data?.type === 'affirmation' || data?.type === 'affirmation-test') {
        // Always play the selected sound
        const config = useRemindersStore.getState().config;
        const soundId = config.soundId || 'default';
        console.log('[Notifications] Playing sound:', soundId);
        playNotificationSound(soundId);
      }
    }
  );

  // Listen for notification responses (when user taps notification)
  notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      console.log('[Notifications] User tapped notification:', data?.type);
      // Could navigate to specific screen here if needed
    }
  );

  unsubscribe = useRemindersStore.subscribe((state, prevState) => {
    // Check if config changed
    if (JSON.stringify(state.config) !== JSON.stringify(prevState.config)) {
      console.log('[Notifications] Config changed, rescheduling...');
      scheduleNotifications();
    }
  });
}

export function cleanupNotificationListener(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  if (notificationReceivedSubscription) {
    notificationReceivedSubscription.remove();
    notificationReceivedSubscription = null;
  }
  if (notificationResponseSubscription) {
    notificationResponseSubscription.remove();
    notificationResponseSubscription = null;
  }
}
