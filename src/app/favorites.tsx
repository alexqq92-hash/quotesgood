import React from 'react';
import { View, Text, Pressable, ScrollView, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Heart, Share2, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { affirmations, CATEGORY_LABELS } from '@/data/affirmations';
import { useCurrentTheme } from '@/lib/theme-store';
import { useFavoritesStore } from '@/lib/favorites-store';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);

  const favoriteAffirmations = affirmations.filter((a) =>
    favoriteIds.includes(a.id)
  );

  const handleRemove = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeFavorite(id);
  };

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
              marginRight: 40,
            }}
          >
            Favorites
          </Text>
        </View>

        {favoriteAffirmations.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 48,
            }}
          >
            <Heart
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
              No favorites yet
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
              Tap the heart icon on any affirmation to save it here
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
              {favoriteAffirmations.length} saved
            </Text>

            {favoriteAffirmations.map((affirmation) => (
              <Animated.View
                key={affirmation.id}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                layout={Layout.springify()}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    alignSelf: 'flex-start',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginBottom: 12,
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
                    {CATEGORY_LABELS[affirmation.category]}
                  </Text>
                </View>

                <Text
                  style={{
                    color: currentTheme.textColor,
                    fontSize: 17,
                    lineHeight: 26,
                    fontWeight: '400',
                  }}
                >
                  {affirmation.text}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 16,
                    gap: 12,
                  }}
                >
                  <Pressable
                    onPress={() => handleShare(affirmation.text)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Share2 size={18} color={currentTheme.iconColor} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleRemove(affirmation.id)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={18} color="#f87171" />
                  </Pressable>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}
