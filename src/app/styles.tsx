import React from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { galaxyThemes, pastelThemes, Theme } from '@/lib/themes';
import { useThemeStore, useCurrentTheme } from '@/lib/theme-store';
import { backgroundImages, useBackgroundStore, useCurrentBackground } from '@/lib/background-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = (SCREEN_WIDTH - 80) / 4;

function ThemeCircle({
  theme,
  isSelected,
  onSelect,
}: {
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          overflow: 'hidden',
          borderWidth: isSelected ? 3 : 0,
          borderColor: '#fff',
          opacity: isSelected ? 0.7 : 1,
        }}
      >
        <LinearGradient
          colors={[...theme.gradientColors]}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isSelected && (
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Check size={18} color="#fff" strokeWidth={3} />
            </View>
          )}
        </LinearGradient>
      </View>
      <Text
        style={{
          color: '#fff',
          fontSize: 12,
          fontWeight: '500',
          marginTop: 8,
          textAlign: 'center',
        }}
      >
        {theme.name}
      </Text>
    </Pressable>
  );
}

function ImageBackgroundCard({
  bgImage,
  isSelected,
  onSelect,
}: {
  bgImage: { id: string; name: string; image: number };
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: isSelected ? 3 : 0,
        borderColor: '#fff',
      }}
    >
      <View style={{ width: '100%', height: 160 }}>
        <Image
          source={bgImage.image}
          style={{
            width: '100%',
            height: '100%',
            opacity: isSelected ? 0.7 : 1,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
        />
        {isSelected && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Check size={24} color="#fff" strokeWidth={3} />
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
          }}
        >
          {bgImage.name}
        </Text>
      </View>
    </Pressable>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 20, marginTop: 10 }}>
      <Text
        style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: 18,
          fontWeight: '700',
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

export default function StylesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const currentTheme = useCurrentTheme();
  const setThemeId = useThemeStore((s) => s.setThemeId);

  const currentBackground = useCurrentBackground();
  const setBackgroundImageId = useBackgroundStore((s) => s.setBackgroundImageId);

  const handleThemeSelect = async (themeId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeId(themeId);
  };

  const handleBackgroundSelect = async (bgId: string | null) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Toggle: if already selected, deselect it
    if (currentBackground?.id === bgId) {
      setBackgroundImageId(null);
    } else {
      setBackgroundImageId(bgId);
      // Navigate to affirmations screen with the background loaded
      router.push('/');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.gradientColors[0] }}>
      <LinearGradient
        colors={[...currentTheme.gradientColors]}
        style={{ flex: 1, paddingTop: insets.top }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <Text
            style={{
              color: currentTheme.textColor,
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
            }}
          >
            Styles
          </Text>
          <Text
            style={{
              color: currentTheme.secondaryTextColor,
              fontSize: 17,
              marginTop: 6,
              fontFamily: 'PlayfairDisplay_400Regular',
            }}
          >
            Choose the color that best represents{'\n'}you or suits you best
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Galaxy Colors Section */}
          <SectionTitle title="Galaxy Colors" />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {galaxyThemes.map((theme) => (
              <ThemeCircle
                key={theme.id}
                theme={theme}
                isSelected={currentTheme.id === theme.id}
                onSelect={() => handleThemeSelect(theme.id)}
              />
            ))}
          </View>

          {/* Pastel Colors Section */}
          <SectionTitle title="Pastel Colors" />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {pastelThemes.map((theme) => (
              <ThemeCircle
                key={theme.id}
                theme={theme}
                isSelected={currentTheme.id === theme.id}
                onSelect={() => handleThemeSelect(theme.id)}
              />
            ))}
          </View>

          {/* Background Images Section */}
          <SectionTitle
            title="Background Images"
            subtitle="Only applies to the affirmations screen"
          />
          {backgroundImages.map((bgImage) => (
            <ImageBackgroundCard
              key={bgImage.id}
              bgImage={bgImage}
              isSelected={currentBackground?.id === bgImage.id}
              onSelect={() => handleBackgroundSelect(bgImage.id)}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
