import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import { useCollectionsStore } from '@/lib/collections-store';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import {
  ChevronLeft,
  Trash2,
  FolderOpen,
} from 'lucide-react-native';

function isLightTheme(theme: { group: string }): boolean {
  return theme.group === 'pastel';
}

function getCardBackground(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return 'rgba(255,255,255,0.9)';
  }
  return 'rgba(255,255,255,0.12)';
}

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

export default function CollectionDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useCurrentTheme();

  const collections = useCollectionsStore((s) => s.collections);
  const removeAffirmationFromCollection = useCollectionsStore(
    (s) => s.removeAffirmationFromCollection
  );

  const collection = collections.find((c) => c.id === id);

  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);
  const secondaryText = getCardSecondaryColor(theme);
  const accentColor = theme.accentColor;

  const handleRemoveAffirmation = (affirmationId: string) => {
    if (!id) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    removeAffirmationFromCollection(id, affirmationId);
  };

  if (!collection) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.gradientColors[0],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: theme.textColor }}>Colección no encontrada</Text>
      </View>
    );
  }

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
            style={{ padding: 8, marginLeft: -8 }}
          >
            <ChevronLeft size={24} color={theme.textColor} />
          </Pressable>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 24,
            }}
          >
            <Text style={{ fontSize: 24, marginRight: 8 }}>{collection.icon}</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.textColor,
              }}
            >
              {collection.name}
            </Text>
          </View>
        </View>

        {/* Collection info */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              backgroundColor: collection.color + '20',
              borderRadius: 12,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: collection.color,
                marginRight: 10,
              }}
            />
            <Text style={{ fontSize: 14, color: cardText }}>
              {collection.affirmations.length}{' '}
              {collection.affirmations.length === 1
                ? 'afirmación guardada'
                : 'afirmaciones guardadas'}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Empty State */}
          {collection.affirmations.length === 0 && (
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              style={{
                alignItems: 'center',
                paddingVertical: 60,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: `${collection.color}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <FolderOpen size={40} color={collection.color} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: cardText,
                  marginBottom: 8,
                }}
              >
                Colección vacía
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: secondaryText,
                  textAlign: 'center',
                  lineHeight: 20,
                  paddingHorizontal: 40,
                }}
              >
                Guarda afirmaciones desde la pantalla principal usando el botón de guardar
              </Text>
            </Animated.View>
          )}

          {/* Affirmations List */}
          {collection.affirmations.map((affirmation, index) => (
            <Animated.View
              key={affirmation.id}
              entering={FadeInDown.delay(100 + index * 50).springify()}
            >
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: cardText,
                    lineHeight: 24,
                    fontStyle: 'italic',
                    marginBottom: 12,
                  }}
                >
                  "{affirmation.text}"
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {affirmation.category && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: secondaryText,
                      }}
                    >
                      {affirmation.category}
                    </Text>
                  )}
                  <Pressable
                    onPress={() => handleRemoveAffirmation(affirmation.id)}
                    style={{
                      padding: 8,
                      marginRight: -8,
                    }}
                  >
                    <Trash2 size={18} color="#FF6B6B" />
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
