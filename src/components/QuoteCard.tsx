import React from 'react';
import { View, Text, Pressable, Share } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Quote, QUOTE_CATEGORY_LABELS } from '@/data/quotes';
import { Theme } from '@/lib/themes';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useCurrentBackground } from '@/lib/background-store';

interface QuoteCardProps {
  quote: Quote;
  theme: Theme;
  currentIndex: number;
  totalCount: number;
}

export function QuoteCard({
  quote,
  theme,
  currentIndex,
  totalCount,
}: QuoteCardProps) {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  // Use quote id with 'quote-' prefix to differentiate from affirmations
  const favoriteId = `quote-${quote.id}`;
  const isFavorite = favoriteIds.includes(favoriteId);

  const currentBackground = useCurrentBackground();

  const handleFavorite = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(favoriteId);
  };

  const handleShare = async (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `"${quote.text}"\n\n— ${quote.author}\n\nSi quieres adentrarte en el mundo de las afirmaciones, este es tu momento ❤️\n\nhttps://apps.apple.com/app/daily-affirmations`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <View style={{ flex: 1, width: '100%' }}>
      {/* Background - Image or Gradient */}
      {currentBackground ? (
        <Image
          source={currentBackground.image}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
        />
      ) : (
        <LinearGradient
          colors={[...theme.gradientColors]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}

      {/* Dark overlay for better text readability when using image */}
      {currentBackground && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.25)',
          }}
        />
      )}

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32,
        }}
      >
        {/* Category Badge */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginBottom: 32,
          }}
        >
          <Text
            style={{
              color: currentBackground ? 'rgba(255,255,255,0.8)' : theme.secondaryTextColor,
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {QUOTE_CATEGORY_LABELS[quote.category]}
          </Text>
        </View>

        {/* Quote Text */}
        <Text
          style={{
            color: currentBackground ? '#ffffff' : theme.textColor,
            fontSize: 28,
            fontWeight: '300',
            textAlign: 'center',
            lineHeight: 42,
            letterSpacing: 0.5,
            fontStyle: 'italic',
          }}
        >
          "{quote.text}"
        </Text>

        {/* Author */}
        <Text
          style={{
            color: currentBackground ? 'rgba(255,255,255,0.8)' : theme.secondaryTextColor,
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center',
            marginTop: 24,
            letterSpacing: 1,
          }}
        >
          — {quote.author}
        </Text>

        {/* Decorative Line */}
        <View
          style={{
            width: 60,
            height: 2,
            backgroundColor: currentBackground ? '#ffffff' : theme.accentColor,
            marginTop: 32,
            borderRadius: 1,
            opacity: 0.6,
          }}
        />
      </View>

      {/* Action Buttons */}
      <View
        style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <Pressable
          onPress={handleFavorite}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Heart
            size={28}
            color={isFavorite ? theme.accentColor : (currentBackground ? 'rgba(255,255,255,0.8)' : theme.iconColor)}
            fill={isFavorite ? theme.accentColor : 'transparent'}
          />
        </Pressable>

        <Pressable
          onPress={handleShare}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Share2 size={28} color={currentBackground ? 'rgba(255,255,255,0.8)' : theme.iconColor} />
        </Pressable>
      </View>
    </View>
  );
}
