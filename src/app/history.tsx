import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Clock, Share2, Heart, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { affirmations, CATEGORY_LABELS, Affirmation } from '@/data/affirmations';
import { useCurrentTheme } from '@/lib/theme-store';
import { useHistoryStore, HistoryEntry } from '@/lib/history-store';
import { useFavoritesStore } from '@/lib/favorites-store';

interface HistoryItemWithAffirmation extends HistoryEntry {
  affirmation: Affirmation;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
}

function groupHistoryByDate(historyItems: HistoryItemWithAffirmation[]): {
  label: string;
  items: HistoryItemWithAffirmation[];
}[] {
  const groups: Map<string, HistoryItemWithAffirmation[]> = new Map();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  historyItems.forEach((item) => {
    const itemDate = new Date(item.viewedAt);
    const itemDay = new Date(
      itemDate.getFullYear(),
      itemDate.getMonth(),
      itemDate.getDate()
    );

    let label: string;
    if (itemDay.getTime() === today.getTime()) {
      label = 'Hoy';
    } else if (itemDay.getTime() === yesterday.getTime()) {
      label = 'Ayer';
    } else {
      label = itemDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      // Capitalize first letter
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }

    const existing = groups.get(label) || [];
    existing.push(item);
    groups.set(label, existing);
  });

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const history = useHistoryStore((s) => s.history);
  const clearHistory = useHistoryStore((s) => s.clearHistory);
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  // Map history entries to affirmations
  const historyWithAffirmations = useMemo(() => {
    const affirmationMap = new Map(affirmations.map((a) => [a.id, a]));
    return history
      .map((entry) => {
        const affirmation = affirmationMap.get(entry.affirmationId);
        if (!affirmation) return null;
        return { ...entry, affirmation };
      })
      .filter((item): item is HistoryItemWithAffirmation => item !== null);
  }, [history]);

  // Group by date
  const groupedHistory = useMemo(
    () => groupHistoryByDate(historyWithAffirmations),
    [historyWithAffirmations]
  );

  const handleShare = async (text: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `"${text}"\n\n— Daily Affirmations`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(id);
  };

  const handleClearHistory = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    clearHistory();
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.gradientColors[0] }}>
      <LinearGradient
        colors={[...currentTheme.gradientColors]}
        style={{
          flex: 1,
          paddingTop: insets.top,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.15)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ChevronLeft size={24} color={currentTheme.iconColor} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              color: currentTheme.textColor,
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Historial
          </Text>
          {historyWithAffirmations.length > 0 && (
            <Pressable
              onPress={handleClearHistory}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Trash2 size={20} color="#f87171" />
            </Pressable>
          )}
          {historyWithAffirmations.length === 0 && <View style={{ width: 40 }} />}
        </View>

        {historyWithAffirmations.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 48,
            }}
          >
            <Clock
              size={64}
              color={currentTheme.secondaryTextColor}
              strokeWidth={1}
            />
            <Text
              style={{
                color: currentTheme.textColor,
                fontSize: 20,
                fontWeight: '600',
                marginTop: 24,
                textAlign: 'center',
              }}
            >
              No hay historial
            </Text>
            <Text
              style={{
                color: currentTheme.secondaryTextColor,
                fontSize: 15,
                marginTop: 12,
                textAlign: 'center',
                lineHeight: 22,
              }}
            >
              Las afirmaciones que veas aparecerán aquí
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 24,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                color: currentTheme.secondaryTextColor,
                fontSize: 13,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                marginBottom: 16,
                marginTop: 8,
              }}
            >
              {historyWithAffirmations.length} vistas
            </Text>

            {groupedHistory.map((group, groupIndex) => (
              <View key={group.label} style={{ marginBottom: 24 }}>
                {/* Date Header */}
                <Animated.View
                  entering={FadeIn.delay(groupIndex * 50).duration(300)}
                >
                  <Text
                    style={{
                      color: currentTheme.textColor,
                      fontSize: 16,
                      fontWeight: '600',
                      marginBottom: 12,
                      opacity: 0.9,
                    }}
                  >
                    {group.label}
                  </Text>
                </Animated.View>

                {/* History Items */}
                {group.items.map((item, itemIndex) => {
                  const isFavorite = favoriteIds.includes(item.affirmation.id);
                  return (
                    <Animated.View
                      key={`${item.affirmationId}-${item.viewedAt}`}
                      entering={FadeInDown.delay(
                        groupIndex * 50 + itemIndex * 30
                      ).duration(300)}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: 18,
                        marginBottom: 10,
                      }}
                    >
                      {/* Time and Category Row */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: currentTheme.secondaryTextColor,
                              fontSize: 10,
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                            }}
                          >
                            {CATEGORY_LABELS[item.affirmation.category]}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Clock
                            size={12}
                            color={currentTheme.secondaryTextColor}
                          />
                          <Text
                            style={{
                              color: currentTheme.secondaryTextColor,
                              fontSize: 11,
                              marginLeft: 4,
                            }}
                          >
                            {formatDate(item.viewedAt)}
                          </Text>
                        </View>
                      </View>

                      {/* Affirmation Text */}
                      <Text
                        style={{
                          color: currentTheme.textColor,
                          fontSize: 16,
                          lineHeight: 24,
                          fontWeight: '400',
                        }}
                      >
                        {item.affirmation.text}
                      </Text>

                      {/* Action Buttons */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          marginTop: 14,
                          gap: 10,
                        }}
                      >
                        <Pressable
                          onPress={() => handleShare(item.affirmation.text)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Share2 size={16} color={currentTheme.iconColor} />
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            handleToggleFavorite(item.affirmation.id)
                          }
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: isFavorite
                              ? `${currentTheme.accentColor}30`
                              : 'rgba(255,255,255,0.1)',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Heart
                            size={16}
                            color={
                              isFavorite
                                ? currentTheme.accentColor
                                : currentTheme.iconColor
                            }
                            fill={isFavorite ? currentTheme.accentColor : 'transparent'}
                          />
                        </Pressable>
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}
