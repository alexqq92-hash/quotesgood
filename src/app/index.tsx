import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Settings, User, Quote } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { AffirmationFeed } from '@/components/AffirmationFeed';
import { AffirmationCategory, CATEGORY_LABELS } from '@/data/affirmations';
import { useCurrentTheme } from '@/lib/theme-store';
import { useSavedStore } from '@/lib/saved-store';

export default function HomeScreen() {
  const { category, categories } = useLocalSearchParams<{ category?: string; categories?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useCurrentTheme();
  const hasUnlockedSaved = useSavedStore((s) => s.hasUnlockedSaved);
  const [showSavedButton, setShowSavedButton] = useState(hasUnlockedSaved);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Animation values
  const savedButtonScale = useSharedValue(0);
  const savedButtonOpacity = useSharedValue(0);

  useEffect(() => {
    if (hasUnlockedSaved && !showSavedButton) {
      // First time unlock animation
      setIsUnlocking(true);
      savedButtonScale.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
      savedButtonOpacity.value = withSpring(1, { damping: 15 }, () => {
        runOnJS(setIsUnlocking)(false);
      });
      setShowSavedButton(true);
    } else if (hasUnlockedSaved && showSavedButton) {
      // Already unlocked, just show
      savedButtonScale.value = 1;
      savedButtonOpacity.value = 1;
    }
  }, [hasUnlockedSaved, showSavedButton]);

  const savedButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: savedButtonScale.value }],
    opacity: savedButtonOpacity.value,
  }));

  const categoryFilter = category as AffirmationCategory | undefined;
  const categoriesFilter = categories
    ? (categories.split(',') as AffirmationCategory[])
    : undefined;

  // For display purposes, show either single category or "Mix" for multiple
  const displayLabel = categoriesFilter
    ? 'Mix personalizado'
    : categoryFilter
      ? CATEGORY_LABELS[categoryFilter]
      : null;

  return (
    <View style={{ flex: 1 }}>
      <AffirmationFeed categoryFilter={categoryFilter} categoriesFilter={categoriesFilter} />

      {/* Settings Button */}
      <Pressable
        onPress={() => router.push('/settings')}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.35)',
          overflow: 'visible',
        }}
      >
        <Settings size={20} color={theme.iconColor} strokeWidth={2} />
      </Pressable>

      {/* Profile Button */}
      <Pressable
        onPress={() => router.push('/profile')}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          right: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.35)',
          overflow: 'visible',
        }}
      >
        <User size={20} color={theme.iconColor} strokeWidth={2} />
      </Pressable>

      {/* Saved Button - appears after first save */}
      {showSavedButton && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: insets.top + 70,
              left: 16,
            },
            savedButtonAnimatedStyle,
          ]}
        >
          <Pressable
            onPress={() => router.push('/saved')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.35)',
              overflow: 'visible',
            }}
          >
            <Image
              source={require('../../assets/images/saved-icon.png')}
              style={{ width: 75, height: 75 }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </Pressable>
        </Animated.View>
      )}

      {/* Quotes Button - below saved button */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + (showSavedButton ? 128 : 70),
          left: 16,
        }}
      >
        <Pressable
          onPress={() => router.push('/quotes')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.35)',
            overflow: 'visible',
          }}
        >
          <Quote size={22} color={theme.iconColor} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Category Filter Badge */}
      {(categoryFilter || categoriesFilter) && (
        <View
          style={{
            position: 'absolute',
            top: insets.top + 12,
            left: 0,
            right: 70,
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => router.push('/')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              paddingVertical: 8,
              paddingLeft: 16,
              paddingRight: 10,
              borderRadius: 20,
              gap: 8,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              {displayLabel}
            </Text>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={14} color="#fff" />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}
