import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Dimensions, StatusBar, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AffirmationCard } from './AffirmationCard';
import { affirmations, shuffleAffirmations, Affirmation, AffirmationCategory, getAffirmationsByCategory, getAffirmationsByCategories } from '@/data/affirmations';
import { useCurrentTheme } from '@/lib/theme-store';
import { Theme } from '@/lib/themes';
import { useHistoryStore } from '@/lib/history-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AffirmationFeedProps {
  categoryFilter?: AffirmationCategory;
  categoriesFilter?: AffirmationCategory[];
}

// Individual card with its own animation logic
function Card({
  affirmation,
  theme,
  index,
  total,
  currentIndexValue,
  fadeProgress,
}: {
  affirmation: Affirmation;
  theme: Theme;
  index: number;
  total: number;
  currentIndexValue: SharedValue<number>;
  fadeProgress: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const currentIdx = currentIndexValue.value;
    const offset = index - currentIdx;
    const progress = fadeProgress.value;

    // Current card fading out
    if (offset === 0) {
      return {
        zIndex: 10,
        opacity: interpolate(progress, [0, 1], [1, 0]),
      };
    }

    // Next card fading in
    if (offset === 1) {
      return {
        zIndex: 5,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      };
    }

    // Previous card fading in (when going backward)
    if (offset === -1) {
      return {
        zIndex: 5,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      };
    }

    // All other cards stay hidden
    return {
      zIndex: 0,
      opacity: 0,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <AffirmationCard
        affirmation={affirmation}
        theme={theme}
        currentIndex={index}
        totalCount={total}
      />
    </Animated.View>
  );
}

const MemoizedCard = React.memo(Card);

export function AffirmationFeed({ categoryFilter, categoriesFilter }: AffirmationFeedProps) {
  const theme = useCurrentTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const addToHistory = useHistoryStore((s) => s.addToHistory);

  // Shared values for animation
  const fadeProgress = useSharedValue(0);
  const currentIndexValue = useSharedValue(0);

  // Filter and shuffle affirmations based on category or categories
  const displayAffirmations = useMemo(() => {
    let filtered: Affirmation[];
    if (categoriesFilter && categoriesFilter.length > 0) {
      filtered = getAffirmationsByCategories(categoriesFilter);
    } else if (categoryFilter) {
      filtered = getAffirmationsByCategory(categoryFilter);
    } else {
      filtered = affirmations;
    }
    return shuffleAffirmations(filtered);
  }, [categoryFilter, categoriesFilter]);

  const totalCount = displayAffirmations.length;

  // Track which affirmations have been added to history to avoid duplicates
  const addedToHistoryRef = useRef<Set<string>>(new Set());

  // Add current affirmation to history when it changes
  useEffect(() => {
    if (displayAffirmations.length > 0) {
      const currentAffirmation = displayAffirmations[currentIndex];
      if (currentAffirmation && !addedToHistoryRef.current.has(currentAffirmation.id)) {
        addToHistory(currentAffirmation.id);
        addedToHistoryRef.current.add(currentAffirmation.id);
      }
    }
  }, [currentIndex, displayAffirmations, addToHistory]);

  // Always render 3 cards: current, next, and previous
  const visibleIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = -1; i <= 1; i++) {
      const idx = currentIndex + i;
      if (idx >= 0 && idx < totalCount) {
        indices.push(idx);
      }
    }
    return indices;
  }, [currentIndex, totalCount]);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const completeTransition = useCallback((newIndex: number) => {
    fadeProgress.value = 0;
    currentIndexValue.value = newIndex;
    setCurrentIndex(newIndex);
    setIsAnimating(false);
  }, [fadeProgress, currentIndexValue]);

  const navigate = useCallback((dir: 1 | -1) => {
    if (isAnimating) return;

    const newIndex = currentIndex + dir;
    if (newIndex < 0 || newIndex >= totalCount) return;

    setIsAnimating(true);
    triggerHaptic();

    // Update the target index for the animation
    currentIndexValue.value = currentIndex;

    fadeProgress.value = withTiming(1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }, () => {
      runOnJS(completeTransition)(newIndex);
    });
  }, [isAnimating, currentIndex, totalCount, fadeProgress, currentIndexValue, triggerHaptic, completeTransition]);

  const handlePress = useCallback((e: { nativeEvent: { locationX: number } }) => {
    const isRightSide = e.nativeEvent.locationX > SCREEN_WIDTH / 2;
    navigate(isRightSide ? 1 : -1);
  }, [navigate]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Pressable style={styles.pressable} onPress={handlePress}>
        <View style={styles.cardContainer}>
          {visibleIndices.map((idx) => (
            <MemoizedCard
              key={`card-${idx}`}
              affirmation={displayAffirmations[idx]}
              theme={theme}
              index={idx}
              total={totalCount}
              currentIndexValue={currentIndexValue}
              fadeProgress={fadeProgress}
            />
          ))}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
  },
});
