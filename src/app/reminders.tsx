import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import {
  useRemindersStore,
  calculateNotificationTimes,
  formatTimeDisplay,
  DAY_LABELS,
  DAYS_ORDER,
  DayOfWeek,
} from '@/lib/reminders-store';
import {
  requestNotificationPermissions,
  sendTestNotification,
  scheduleNotifications,
} from '@/lib/notifications';
import { RELAXING_SOUNDS, getSoundById, playPreviewSound, stopPreviewSound, setPlaybackStatusCallback, preloadAllSounds, unloadAllSounds } from '@/lib/sounds';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Bell,
  Clock,
  Repeat,
  ChevronDown,
  Minus,
  Plus,
  Sparkles,
  Send,
  Volume2,
  Check,
  Play,
  Pause,
} from 'lucide-react-native';

// Helper to determine if theme is light or dark
function isLightTheme(theme: { group: string }): boolean {
  return theme.group === 'pastel';
}

// Helper to get card background that adapts to theme
function getCardBackground(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return 'rgba(255,255,255,0.9)';
  }
  return 'rgba(255,255,255,0.12)';
}

// Helper to get text colors for cards
function getCardTextColor(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return '#1a1a2e';
  }
  return '#ffffff';
}

function getCardSecondaryColor(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return '#666666';
  }
  return 'rgba(255,255,255,0.6)';
}

// Time Picker Modal Component
function TimePickerModal({
  visible,
  onClose,
  onSelect,
  currentTime,
  title,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  currentTime: string;
  title: string;
  theme: ReturnType<typeof useCurrentTheme>;
}) {
  const [hour, setHour] = useState(() => parseInt(currentTime.split(':')[0]));
  const [minute, setMinute] = useState(() => parseInt(currentTime.split(':')[1]));

  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);

  const handleConfirm = () => {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onSelect(timeStr);
    onClose();
  };

  const adjustHour = (delta: number) => {
    Haptics.selectionAsync();
    setHour((prev) => {
      const newHour = prev + delta;
      if (newHour < 0) return 23;
      if (newHour > 23) return 0;
      return newHour;
    });
  };

  const adjustMinute = (delta: number) => {
    Haptics.selectionAsync();
    setMinute((prev) => {
      const newMin = prev + delta;
      if (newMin < 0) return 55;
      if (newMin > 59) return 0;
      return newMin;
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        onPress={onClose}
      >
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{
            backgroundColor: isLightTheme(theme) ? '#ffffff' : '#1a1a2e',
            borderRadius: 24,
            padding: 24,
            width: '100%',
            maxWidth: 320,
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: cardText,
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              {title}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              {/* Hours */}
              <View style={{ alignItems: 'center' }}>
                <Pressable
                  onPress={() => adjustHour(1)}
                  style={{
                    padding: 12,
                    backgroundColor: `${theme.accentColor}20`,
                    borderRadius: 12,
                  }}
                >
                  <Plus size={20} color={theme.accentColor} />
                </Pressable>
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: '700',
                    color: cardText,
                    marginVertical: 8,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {hour.toString().padStart(2, '0')}
                </Text>
                <Pressable
                  onPress={() => adjustHour(-1)}
                  style={{
                    padding: 12,
                    backgroundColor: `${theme.accentColor}20`,
                    borderRadius: 12,
                  }}
                >
                  <Minus size={20} color={theme.accentColor} />
                </Pressable>
              </View>

              <Text
                style={{
                  fontSize: 48,
                  fontWeight: '700',
                  color: cardText,
                }}
              >
                :
              </Text>

              {/* Minutes */}
              <View style={{ alignItems: 'center' }}>
                <Pressable
                  onPress={() => adjustMinute(5)}
                  style={{
                    padding: 12,
                    backgroundColor: `${theme.accentColor}20`,
                    borderRadius: 12,
                  }}
                >
                  <Plus size={20} color={theme.accentColor} />
                </Pressable>
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: '700',
                    color: cardText,
                    marginVertical: 8,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {minute.toString().padStart(2, '0')}
                </Text>
                <Pressable
                  onPress={() => adjustMinute(-5)}
                  style={{
                    padding: 12,
                    backgroundColor: `${theme.accentColor}20`,
                    borderRadius: 12,
                  }}
                >
                  <Minus size={20} color={theme.accentColor} />
                </Pressable>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                marginTop: 24,
              }}
            >
              <Pressable
                onPress={onClose}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: `${theme.accentColor}20`,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.accentColor,
                  }}
                >
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: theme.accentColor,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}
                >
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// Day Toggle Button Component
function DayToggle({
  day,
  isActive,
  onToggle,
  accentColor,
  cardText,
}: {
  day: DayOfWeek;
  isActive: boolean;
  onToggle: () => void;
  accentColor: string;
  cardText: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    });
    Haptics.selectionAsync();
    onToggle();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: isActive ? accentColor : 'transparent',
            borderWidth: 2,
            borderColor: isActive ? accentColor : `${cardText}30`,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: isActive ? '#ffffff' : cardText,
          }}
        >
          {DAY_LABELS[day].short}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// Settings Row Component
function SettingsRow({
  icon,
  label,
  value,
  onPress,
  isLast = false,
  cardText,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
  cardText: string;
  accentColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: `${cardText}10`,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: `${accentColor}20`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: '500',
          color: cardText,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 15,
            color: accentColor,
            fontWeight: '500',
            marginRight: 4,
          }}
        >
          {value}
        </Text>
        <ChevronDown size={18} color={accentColor} />
      </View>
    </Pressable>
  );
}

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useCurrentTheme();

  // Store selectors
  const enabled = useRemindersStore((s) => s.config.enabled);
  const startTime = useRemindersStore((s) => s.config.startTime);
  const endTime = useRemindersStore((s) => s.config.endTime);
  const frequency = useRemindersStore((s) => s.config.frequency);
  const activeDays = useRemindersStore((s) => s.config.activeDays);
  const soundId = useRemindersStore((s) => s.config.soundId);
  const setEnabled = useRemindersStore((s) => s.setEnabled);
  const setStartTime = useRemindersStore((s) => s.setStartTime);
  const setEndTime = useRemindersStore((s) => s.setEndTime);
  const setFrequency = useRemindersStore((s) => s.setFrequency);
  const toggleDay = useRemindersStore((s) => s.toggleDay);
  const setSoundId = useRemindersStore((s) => s.setSoundId);

  // Modal states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  // Sound playback state
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);

  // Get current sound
  const currentSound = getSoundById(soundId);

  // Theme colors
  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);
  const secondaryText = getCardSecondaryColor(theme);
  const accentColor = theme.accentColor;

  // Setup playback status callback
  useEffect(() => {
    setPlaybackStatusCallback((soundIdPlaying, isPlaying) => {
      setPlayingSoundId(isPlaying ? soundIdPlaying : null);
    });

    return () => {
      setPlaybackStatusCallback(null);
      stopPreviewSound();
    };
  }, []);

  // Precargar sonidos cuando se abre el modal
  useEffect(() => {
    if (showSoundPicker) {
      preloadAllSounds();
    } else {
      stopPreviewSound();
    }
  }, [showSoundPicker]);

  // Calculate scheduled times for preview
  const scheduledTimes = useMemo(() => {
    return calculateNotificationTimes({
      enabled,
      startTime,
      endTime,
      frequency,
      activeDays,
      soundId,
    });
  }, [enabled, startTime, endTime, frequency, activeDays, soundId]);

  // Handle enabling reminders
  const handleToggleEnabled = async (value: boolean) => {
    if (value) {
      // Request notification permissions using our helper
      const granted = await requestNotificationPermissions();

      if (!granted) {
        // Permission denied - don't enable
        return;
      }
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEnabled(value);

    // Schedule notifications after enabling
    if (value) {
      await scheduleNotifications();
    }
  };

  // Handle test notification
  const handleTestNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await sendTestNotification();
  };

  // Handle sound change
  const handleSoundChange = async (newSoundId: string) => {
    // Primero reproducir el sonido seleccionado
    await playPreviewSound(newSoundId);
    // Guardar la selección
    setSoundId(newSoundId);
    if (enabled) {
      setTimeout(async () => {
        await scheduleNotifications();
      }, 100);
    }
  };

  // Preview sound when tapped in picker (play/pause toggle)
  const handleSoundPreview = useCallback(async (previewSoundId: string) => {
    await playPreviewSound(previewSoundId);
  }, []);

  // Close sound picker
  const handleCloseSoundPicker = async () => {
    await stopPreviewSound();
    setShowSoundPicker(false);
  };

  // Handle frequency change
  const handleFrequencyChange = (delta: number) => {
    Haptics.selectionAsync();
    const newFreq = Math.max(1, Math.min(12, frequency + delta));
    setFrequency(newFreq);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.gradientColors[0] }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.gradientColors[0],
          paddingTop: insets.top,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              padding: 8,
              marginLeft: -8,
            }}
          >
            <ChevronLeft size={24} color={theme.textColor} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: '600',
              color: theme.textColor,
              marginRight: 24,
            }}
          >
            Recordatorios
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Enable Toggle Card */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: `${accentColor}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <Bell size={24} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: cardText,
                    marginBottom: 4,
                  }}
                >
                  Activar Recordatorios
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: secondaryText,
                  }}
                >
                  Recibe afirmaciones diarias
                </Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={handleToggleEnabled}
                trackColor={{ false: `${cardText}20`, true: accentColor }}
                thumbColor="#ffffff"
              />
            </View>
          </Animated.View>

          {/* Time Settings Card */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.textColor,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              Horario
            </Text>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 20,
                opacity: enabled ? 1 : 0.5,
              }}
              pointerEvents={enabled ? 'auto' : 'none'}
            >
              <SettingsRow
                icon={<Clock size={20} color={accentColor} />}
                label="Hora de inicio"
                value={formatTimeDisplay(startTime)}
                onPress={() => setShowStartTimePicker(true)}
                cardText={cardText}
                accentColor={accentColor}
              />
              <SettingsRow
                icon={<Clock size={20} color={accentColor} />}
                label="Hora de fin"
                value={formatTimeDisplay(endTime)}
                onPress={() => setShowEndTimePicker(true)}
                isLast
                cardText={cardText}
                accentColor={accentColor}
              />
            </View>
          </Animated.View>

          {/* Frequency Card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.textColor,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              Frecuencia
            </Text>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                opacity: enabled ? 1 : 0.5,
              }}
              pointerEvents={enabled ? 'auto' : 'none'}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: `${accentColor}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Repeat size={20} color={accentColor} />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: cardText,
                    }}
                  >
                    Veces al día
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Pressable
                    onPress={() => handleFrequencyChange(-1)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: `${accentColor}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Minus size={18} color={accentColor} />
                  </Pressable>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: '700',
                      color: accentColor,
                      minWidth: 32,
                      textAlign: 'center',
                    }}
                  >
                    {frequency}
                  </Text>
                  <Pressable
                    onPress={() => handleFrequencyChange(1)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: `${accentColor}20`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={18} color={accentColor} />
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Days Card */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.textColor,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              Días de la semana
            </Text>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                opacity: enabled ? 1 : 0.5,
              }}
              pointerEvents={enabled ? 'auto' : 'none'}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {DAYS_ORDER.map((day) => (
                  <DayToggle
                    key={day}
                    day={day}
                    isActive={activeDays.includes(day)}
                    onToggle={() => toggleDay(day)}
                    accentColor={accentColor}
                    cardText={cardText}
                  />
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Sound Selector Card */}
          <Animated.View entering={FadeInDown.delay(280).springify()}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.textColor,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              Sonido
            </Text>
            <Pressable
              onPress={() => setShowSoundPicker(true)}
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${accentColor}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Volume2 size={22} color={accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: cardText,
                  }}
                >
                  {currentSound.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: secondaryText,
                    marginTop: 2,
                  }}
                >
                  {currentSound.description}
                </Text>
              </View>
              <Text style={{ fontSize: 20 }}>{currentSound.icon}</Text>
            </Pressable>
          </Animated.View>

          {/* Preview Card */}
          {enabled && scheduledTimes.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.textColor,
                  marginBottom: 12,
                  marginLeft: 4,
                }}
              >
                Vista previa
              </Text>
              <View
                style={{
                  backgroundColor: `${accentColor}15`,
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Sparkles size={20} color={accentColor} />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: theme.textColor,
                      marginLeft: 8,
                    }}
                  >
                    Recibirás afirmaciones a las:
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {scheduledTimes.map((time, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: cardBg,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: cardText,
                        }}
                      >
                        {formatTimeDisplay(time)}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: secondaryText,
                    marginTop: 12,
                  }}
                >
                  Los días:{' '}
                  {activeDays.map((d) => DAY_LABELS[d].full).join(', ')}
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Test Notification Button */}
          {enabled && (
            <Animated.View entering={FadeInDown.delay(350).springify()}>
              <Pressable
                onPress={handleTestNotification}
                style={{
                  backgroundColor: accentColor,
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Send size={20} color="#ffffff" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                    marginLeft: 10,
                  }}
                >
                  Enviar notificación de prueba
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Info Text */}
          <Text
            style={{
              fontSize: 13,
              color: theme.textColor,
              opacity: 0.6,
              textAlign: 'center',
              marginTop: 8,
              lineHeight: 18,
              paddingHorizontal: 20,
            }}
          >
            Los recordatorios se distribuirán automáticamente entre la hora de inicio y fin
          </Text>
        </ScrollView>
      </View>

      {/* Time Picker Modals */}
      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onSelect={setStartTime}
        currentTime={startTime}
        title="Hora de inicio"
        theme={theme}
      />
      <TimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onSelect={setEndTime}
        currentTime={endTime}
        title="Hora de fin"
        theme={theme}
      />

      {/* Sound Picker Modal */}
      <Modal
        visible={showSoundPicker}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSoundPicker}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
          onPress={handleCloseSoundPicker}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={{
              backgroundColor: isLightTheme(theme) ? '#ffffff' : '#1a1a2e',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              maxHeight: '70%',
            }}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: `${cardText}30`,
                  borderRadius: 2,
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: cardText,
                  textAlign: 'center',
                  marginBottom: 20,
                }}
              >
                Elige un sonido
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: secondaryText,
                  textAlign: 'center',
                  marginBottom: 16,
                  paddingHorizontal: 20,
                }}
              >
                Toca para escuchar y seleccionar
              </Text>
              <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
              >
                {RELAXING_SOUNDS.map((sound) => {
                  const isPlaying = playingSoundId === sound.id;
                  const isSelected = soundId === sound.id;

                  return (
                    <Pressable
                      key={sound.id}
                      onPress={() => handleSoundChange(sound.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        marginBottom: 10,
                        backgroundColor: isPlaying
                          ? `${accentColor}25`
                          : isSelected
                          ? `${accentColor}15`
                          : `${cardText}05`,
                        borderRadius: 14,
                        borderWidth: isSelected || isPlaying ? 1.5 : 0,
                        borderColor: isPlaying ? accentColor : isSelected ? accentColor : 'transparent',
                      }}
                    >
                      {/* Play/Pause button */}
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: isPlaying ? accentColor : `${accentColor}20`,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 14,
                        }}
                      >
                        {isPlaying ? (
                          <Pause size={22} color="#ffffff" fill="#ffffff" />
                        ) : (
                          <Play size={22} color={accentColor} fill={accentColor} />
                        )}
                      </View>

                      {/* Sound info */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ fontSize: 22, marginRight: 10 }}>{sound.icon}</Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              color: cardText,
                            }}
                          >
                            {sound.name}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 13,
                            color: secondaryText,
                            marginTop: 4,
                            marginLeft: 32,
                          }}
                        >
                          {sound.description}
                        </Text>
                      </View>

                      {/* Selection indicator */}
                      {isSelected && (
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: accentColor,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={16} color="#ffffff" strokeWidth={3} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
