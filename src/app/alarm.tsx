import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import {
  useAlarmStore,
  formatTimeDisplay,
  DAY_LABELS,
  DAYS_ORDER,
  DayOfWeek,
} from '@/lib/alarm-store';
import { scheduleAlarm, sendTestAlarm, requestNotificationPermissions } from '@/lib/alarm-notifications';
import { RELAXING_SOUNDS, getSoundById, playPreviewSound, stopPreviewSound, setPlaybackStatusCallback, preloadAllSounds } from '@/lib/sounds';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  AlarmClock,
  Minus,
  Plus,
  Sparkles,
  Send,
  Sun,
  Moon,
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

// Animated Clock Display Component
function AnimatedClockDisplay({
  time,
  onPress,
  accentColor,
  cardText,
  enabled,
}: {
  time: string;
  onPress: () => void;
  accentColor: string;
  cardText: string;
  enabled: boolean;
}) {
  const [hour, minute] = time.split(':').map(Number);
  const isPM = hour >= 12;
  const displayHour = hour % 12 || 12;

  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (enabled) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(pulseScale);
      cancelAnimation(glowOpacity);
      pulseScale.value = withTiming(1);
      glowOpacity.value = withTiming(0.2);
    }
  }, [enabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={animatedStyle}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 30,
            position: 'relative',
          }}
        >
          {/* Glow effect behind */}
          {enabled && (
            <Animated.View
              style={[
                glowStyle,
                {
                  position: 'absolute',
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: accentColor,
                },
              ]}
            />
          )}

          {/* Time display */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text
              style={{
                fontSize: 72,
                fontWeight: '200',
                color: enabled ? cardText : `${cardText}50`,
                fontVariant: ['tabular-nums'],
                letterSpacing: -2,
              }}
            >
              {displayHour.toString().padStart(2, '0')}
            </Text>
            <Text
              style={{
                fontSize: 72,
                fontWeight: '200',
                color: enabled ? accentColor : `${cardText}30`,
                marginHorizontal: 4,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: 72,
                fontWeight: '200',
                color: enabled ? cardText : `${cardText}50`,
                fontVariant: ['tabular-nums'],
                letterSpacing: -2,
              }}
            >
              {minute.toString().padStart(2, '0')}
            </Text>
          </View>

          {/* AM/PM indicator */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
              backgroundColor: enabled ? `${accentColor}20` : `${cardText}10`,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            {isPM ? (
              <Moon size={18} color={enabled ? accentColor : `${cardText}50`} />
            ) : (
              <Sun size={18} color={enabled ? accentColor : `${cardText}50`} />
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: enabled ? accentColor : `${cardText}50`,
                marginLeft: 8,
              }}
            >
              {isPM ? 'PM' : 'AM'}
            </Text>
          </View>

          {/* Tap to edit hint */}
          <Text
            style={{
              fontSize: 13,
              color: `${cardText}60`,
              marginTop: 16,
            }}
          >
            Toca para cambiar la hora
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// Time Picker Modal Component
function TimePickerModal({
  visible,
  onClose,
  onSelect,
  currentTime,
  theme,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  currentTime: string;
  theme: ReturnType<typeof useCurrentTheme>;
}) {
  const [hour, setHour] = useState(() => parseInt(currentTime.split(':')[0]));
  const [minute, setMinute] = useState(() => parseInt(currentTime.split(':')[1]));

  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);

  // Update state when modal opens with new time
  useEffect(() => {
    if (visible) {
      setHour(parseInt(currentTime.split(':')[0]));
      setMinute(parseInt(currentTime.split(':')[1]));
    }
  }, [visible, currentTime]);

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
              Configurar Alarma
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

            {/* AM/PM indicator */}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: theme.accentColor,
                fontWeight: '600',
                marginTop: 16,
              }}
            >
              {hour >= 12 ? 'PM' : 'AM'}
            </Text>

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
  enabled,
}: {
  day: DayOfWeek;
  isActive: boolean;
  onToggle: () => void;
  accentColor: string;
  cardText: string;
  enabled: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!enabled) return;
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
            backgroundColor: isActive && enabled ? accentColor : 'transparent',
            borderWidth: 2,
            borderColor: isActive && enabled ? accentColor : `${cardText}30`,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: enabled ? 1 : 0.5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: isActive && enabled ? '#ffffff' : cardText,
          }}
        >
          {DAY_LABELS[day].short}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function AlarmScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useCurrentTheme();

  // Store selectors
  const enabled = useAlarmStore((s) => s.config.enabled);
  const time = useAlarmStore((s) => s.config.time);
  const activeDays = useAlarmStore((s) => s.config.activeDays);
  const soundId = useAlarmStore((s) => s.config.soundId);
  const setEnabled = useAlarmStore((s) => s.setEnabled);
  const setTime = useAlarmStore((s) => s.setTime);
  const toggleDay = useAlarmStore((s) => s.toggleDay);
  const setSoundId = useAlarmStore((s) => s.setSoundId);

  // Modal state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
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

  // Handle enabling alarm
  const handleToggleEnabled = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        console.log('[AlarmScreen] Permission denied');
        return;
      }
      console.log('[AlarmScreen] Permission granted');
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEnabled(value);

    // Schedule or cancel alarm
    setTimeout(async () => {
      await scheduleAlarm();
    }, 100);
  };

  // Handle time change
  const handleTimeChange = async (newTime: string) => {
    setTime(newTime);
    if (enabled) {
      setTimeout(async () => {
        await scheduleAlarm();
      }, 100);
    }
  };

  // Handle day toggle
  const handleDayToggle = async (day: DayOfWeek) => {
    toggleDay(day);
    if (enabled) {
      setTimeout(async () => {
        await scheduleAlarm();
      }, 100);
    }
  };

  // Handle sound change - selecciona y reproduce
  const handleSoundChange = async (newSoundId: string) => {
    await playPreviewSound(newSoundId);
    setSoundId(newSoundId);
    if (enabled) {
      setTimeout(async () => {
        await scheduleAlarm();
      }, 100);
    }
  };

  // Close sound picker
  const handleCloseSoundPicker = async () => {
    await stopPreviewSound();
    setShowSoundPicker(false);
  };

  // Handle test alarm
  const handleTestAlarm = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const success = await sendTestAlarm();
    console.log('[AlarmScreen] Test alarm result:', success);
  };

  // Get active days text
  const getActiveDaysText = () => {
    if (activeDays.length === 7) {
      return 'Todos los días';
    }
    if (activeDays.length === 0) {
      return 'Ningún día seleccionado';
    }
    const weekdays: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
    const weekend: DayOfWeek[] = ['sat', 'sun'];

    const hasAllWeekdays = weekdays.every((d) => activeDays.includes(d));
    const hasNoWeekend = !weekend.some((d) => activeDays.includes(d));
    const hasAllWeekend = weekend.every((d) => activeDays.includes(d));
    const hasNoWeekdays = !weekdays.some((d) => activeDays.includes(d));

    if (hasAllWeekdays && hasNoWeekend) {
      return 'Lunes a Viernes';
    }
    if (hasAllWeekend && hasNoWeekdays) {
      return 'Fines de semana';
    }

    return activeDays.map((d) => DAY_LABELS[d].short).join(', ');
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
            Alarma Diaria
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Alarm Card */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 24,
                marginBottom: 20,
                alignItems: 'center',
              }}
            >
              {/* Alarm Icon and Toggle */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: enabled ? `${accentColor}20` : `${cardText}10`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <AlarmClock size={24} color={enabled ? accentColor : `${cardText}50`} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: cardText,
                      }}
                    >
                      Alarma Activa
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: secondaryText,
                      }}
                    >
                      {getActiveDaysText()}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={enabled}
                  onValueChange={handleToggleEnabled}
                  trackColor={{ false: `${cardText}20`, true: accentColor }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Clock Display */}
              <AnimatedClockDisplay
                time={time}
                onPress={() => setShowTimePicker(true)}
                accentColor={accentColor}
                cardText={cardText}
                enabled={enabled}
              />
            </View>
          </Animated.View>

          {/* Days Card */}
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
              Repetir
            </Text>
            <View
              style={{
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
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
                    onToggle={() => handleDayToggle(day)}
                    accentColor={accentColor}
                    cardText={cardText}
                    enabled={enabled}
                  />
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Sound Selector Card */}
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

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <View
              style={{
                backgroundColor: `${accentColor}15`,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Sparkles size={24} color={accentColor} />
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: theme.textColor,
                    marginBottom: 4,
                  }}
                >
                  Tu momento sagrado
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: secondaryText,
                    lineHeight: 18,
                  }}
                >
                  Esta alarma te recordará practicar tus afirmaciones diarias. Crea el hábito de empezar tu día con pensamientos positivos.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Test Alarm Button */}
          {enabled && (
            <Animated.View entering={FadeInDown.delay(350).springify()}>
              <Pressable
                onPress={handleTestAlarm}
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
                  Probar alarma
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSelect={handleTimeChange}
        currentTime={time}
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
