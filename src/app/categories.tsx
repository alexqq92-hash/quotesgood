import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Settings } from 'lucide-react-native';
import {
  getAllCategories,
  CATEGORY_LABELS,
  AffirmationCategory,
} from '@/data/affirmations';
import { CategoryIcon } from '@/components/CategoryIcons';
import { useCurrentTheme } from '@/lib/theme-store';
import { BottomTabBar } from '@/components/BottomTabBar';

const HORIZONTAL_PADDING = 12;
const GAP = 10;
const COLUMNS = 3;

// Categories to hide from the list
const HIDDEN_CATEGORIES: AffirmationCategory[] = ['heartbreak', 'fatherhood', 'students', 'blessings'];

// Helper to determine if theme is light or dark
function isLightTheme(theme: { group: string }): boolean {
  return theme.group === 'pastel';
}

// Helper to get card background that adapts to theme
function getCardBackground(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return 'rgba(255,255,255,0.85)';
  }
  return 'rgba(255,255,255,0.15)';
}

// Helper to get text colors for cards
function getCardTextColor(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return '#1a1a2e';
  }
  return '#ffffff';
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const theme = useCurrentTheme();
  const categories = getAllCategories().filter(cat => !HIDDEN_CATEGORIES.includes(cat));

  // Theme-adaptive colors
  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);

  // Limit max width for larger screens, optimize for iOS mobile
  const effectiveWidth = Math.min(screenWidth, 500);
  const cardSize = (effectiveWidth - (HORIZONTAL_PADDING * 2) - (GAP * (COLUMNS - 1))) / COLUMNS;
  const iconSize = 44;

  const handleCategoryPress = (category: AffirmationCategory) => {
    router.push(`/?category=${category}`);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.gradientColors[0] }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.gradientColors[0],
        }}
      >
        {/* Header */}
        <View
          style={{
            height: insets.top + 52,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 12,
          }}
        >
          <Pressable
            onPress={handleClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: cardBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color={cardText} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/settings')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: cardBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={20} color={cardText} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor, fontStyle: 'italic' }]}>Tell me your preferences</Text>
          </View>

          <View style={[styles.grid, { maxWidth: 500, alignSelf: 'center', width: '100%' }]}>
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => handleCategoryPress(category)}
                style={({ pressed }) => ({
                  width: cardSize,
                  height: cardSize,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon category={category} color={cardText} size={iconSize} />
                  <Text style={[styles.cardLabel, { color: cardText, marginTop: 8 }]} numberOfLines={2}>{CATEGORY_LABELS[category]}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Tab Bar with solid background */}
        <View
          style={{
            backgroundColor: theme.gradientColors[2],
            paddingTop: 16,
          }}
        >
          <BottomTabBar embedded />
          <View style={{ height: insets.bottom }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
