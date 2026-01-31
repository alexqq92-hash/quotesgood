import React from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentTheme } from '@/lib/theme-store';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import {
  X,
  Settings,
} from 'lucide-react-native';
import Svg, { Path, Circle, Rect, Line, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Helper to determine if theme is light or dark
function isLightTheme(theme: { group: string }): boolean {
  return theme.group === 'pastel';
}

// Helper to get card background that adapts to theme
function getCardBackground(theme: { group: string; gradientColors: readonly string[] }): string {
  if (isLightTheme(theme)) {
    return 'rgba(255,255,255,0.9)';
  }
  return 'rgba(255,255,255,0.12)';
}

// Helper to get premium banner background based on theme
function getPremiumBannerBg(theme: { group: string; accentColor: string; textColor: string }): string {
  if (isLightTheme(theme)) {
    // For light/pastel themes, use the accent color which matches the theme's tone better
    return theme.accentColor;
  }
  // For dark themes, use a semi-transparent dark overlay
  return 'rgba(0,0,0,0.5)';
}

// Helper to get text colors for cards
function getCardTextColor(theme: { group: string; textColor: string }): string {
  if (isLightTheme(theme)) {
    return '#1a1a2e';
  }
  return '#ffffff';
}

// Helper to get reminders card background - lighter than premium banner
function getRemindersCardBg(theme: { group: string; textColor: string; accentColor: string }): string {
  if (isLightTheme(theme)) {
    // For light themes, use accent color with very low opacity for a soft, light look
    return theme.accentColor + '35'; // ~21% opacity - soft and light
  }
  // For dark themes, use accent color with low transparency
  return theme.accentColor + '25'; // ~15% opacity
}

// Helper to get reminders card text color
function getRemindersCardTextColor(theme: { group: string; textColor: string }): string {
  // Use the theme's text color so it adapts properly
  return theme.textColor;
}

function getCardSecondaryColor(theme: { group: string }): string {
  if (isLightTheme(theme)) {
    return '#666666';
  }
  return 'rgba(255,255,255,0.6)';
}

// Crown illustration for premium banner
function CrownIllustration({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Main crown shape */}
      <Path
        d="M20 70 L20 45 L35 55 L50 30 L65 55 L80 45 L80 70 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.9}
      />
      {/* Crown base */}
      <Line x1="20" y1="70" x2="80" y2="70" stroke={color} strokeWidth={1.5} opacity={0.9} />
      {/* Crown jewels - circles at peaks */}
      <Circle cx="50" cy="28" r="3" fill="none" stroke={color} strokeWidth={1.2} opacity={0.8} />
      <Circle cx="20" cy="43" r="2.5" fill="none" stroke={color} strokeWidth={1.2} opacity={0.7} />
      <Circle cx="80" cy="43" r="2.5" fill="none" stroke={color} strokeWidth={1.2} opacity={0.7} />
      {/* Inner decoration lines */}
      <Line x1="35" y1="55" x2="35" y2="70" stroke={color} strokeWidth={1} opacity={0.4} />
      <Line x1="50" y1="45" x2="50" y2="70" stroke={color} strokeWidth={1} opacity={0.4} />
      <Line x1="65" y1="55" x2="65" y2="70" stroke={color} strokeWidth={1} opacity={0.4} />
      {/* Sparkles */}
      <Circle cx="88" cy="30" r="1.5" fill={color} opacity={0.7} />
      <Circle cx="92" cy="50" r="1" fill={color} opacity={0.5} />
      <Circle cx="85" cy="60" r="1.2" fill={color} opacity={0.6} />
      {/* Plus signs as stars */}
      <Path d="M90 38 L94 38 M92 36 L92 40" stroke={color} strokeWidth={1} opacity={0.5} />
      <Path d="M12 55 L16 55 M14 53 L14 57" stroke={color} strokeWidth={1} opacity={0.4} />
    </Svg>
  );
}

// Affirmation cards illustration
function AffirmationCardsIcon({ color }: { color: string }) {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      {/* Back card */}
      <Rect
        x="22"
        y="15"
        width="40"
        height="50"
        rx="6"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        transform="rotate(-15 42 40)"
        opacity={0.5}
      />
      {/* Middle card */}
      <Rect
        x="20"
        y="18"
        width="40"
        height="50"
        rx="6"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        transform="rotate(-5 40 43)"
        opacity={0.7}
      />
      {/* Front card */}
      <Rect
        x="18"
        y="20"
        width="40"
        height="50"
        rx="6"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Decorative lines on front card */}
      <Line x1="26" y1="36" x2="50" y2="36" stroke={color} strokeWidth={1.2} opacity={0.6} />
      <Line x1="26" y1="45" x2="46" y2="45" stroke={color} strokeWidth={1.2} opacity={0.5} />
      <Line x1="26" y1="54" x2="42" y2="54" stroke={color} strokeWidth={1.2} opacity={0.4} />
      {/* Sparkle */}
      <Circle cx="65" cy="15" r="1.5" fill={color} opacity={0.6} />
      <Path d="M62 20 L66 20 M64 18 L64 22" stroke={color} strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}

// Bell notification icon
function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      {/* Bell body */}
      <Path
        d="M40 15 C28 15 20 25 20 38 L20 50 L15 55 L65 55 L60 50 L60 38 C60 25 52 15 40 15"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Bell clapper */}
      <Circle cx="40" cy="62" r="5" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Bell top */}
      <Circle cx="40" cy="12" r="3" fill="none" stroke={color} strokeWidth={1.5} />
      {/* Sparkles */}
      <Circle cx="65" cy="25" r="1.5" fill={color} opacity={0.6} />
      <Path d="M60 35 L64 35 M62 33 L62 37" stroke={color} strokeWidth={1} opacity={0.5} />
      <Circle cx="18" cy="30" r="1" fill={color} opacity={0.5} />
    </Svg>
  );
}

// Digital alarm clock icon for reminders card
function DigitalAlarmIcon({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Main clock body - rounded rectangle */}
      <Rect
        x="15"
        y="25"
        width="70"
        height="45"
        rx="8"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Clock legs */}
      <Line x1="25" y1="70" x2="20" y2="78" stroke={color} strokeWidth={1.5} opacity={0.8} />
      <Line x1="75" y1="70" x2="80" y2="78" stroke={color} strokeWidth={1.5} opacity={0.8} />
      {/* Alarm bells on top */}
      <Circle cx="28" cy="20" r="6" fill="none" stroke={color} strokeWidth={1.2} opacity={0.8} />
      <Circle cx="72" cy="20" r="6" fill="none" stroke={color} strokeWidth={1.2} opacity={0.8} />
      {/* Bell connector bar */}
      <Line x1="34" y1="18" x2="66" y2="18" stroke={color} strokeWidth={1.2} opacity={0.6} />
      {/* Digital display time */}
      <SvgText x="50" y="52" fontSize="16" fill={color} fontWeight="bold" textAnchor="middle">7:00</SvgText>
      {/* AM indicator */}
      <SvgText x="72" y="42" fontSize="6" fill={color} opacity={0.7}>AM</SvgText>
      {/* Small dots on display */}
      <Circle cx="25" cy="47" r="1.5" fill={color} opacity={0.5} />
      <Circle cx="25" cy="53" r="1.5" fill={color} opacity={0.5} />
      {/* Sparkles around */}
      <Circle cx="92" cy="30" r="1.5" fill={color} opacity={0.6} />
      <Circle cx="8" cy="40" r="1" fill={color} opacity={0.5} />
      <Path d="M88 45 L92 45 M90 43 L90 47" stroke={color} strokeWidth={1} opacity={0.5} />
      <Path d="M5 55 L9 55 M7 53 L7 57" stroke={color} strokeWidth={1} opacity={0.4} />
      {/* Sound waves from bells */}
      <Path d="M18 12 Q15 10 18 8" stroke={color} strokeWidth={0.8} fill="none" opacity={0.5} />
      <Path d="M82 12 Q85 10 82 8" stroke={color} strokeWidth={0.8} fill="none" opacity={0.5} />
    </Svg>
  );
}

// Sunrise alarm icon for daily alarm card
function SunriseAlarmIcon({ color }: { color: string }) {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Sun */}
      <Circle cx="50" cy="55" r="20" fill="none" stroke={color} strokeWidth={1.8} />
      {/* Sun rays */}
      <Line x1="50" y1="25" x2="50" y2="15" stroke={color} strokeWidth={1.8} />
      <Line x1="20" y1="55" x2="10" y2="55" stroke={color} strokeWidth={1.8} />
      <Line x1="80" y1="55" x2="90" y2="55" stroke={color} strokeWidth={1.8} />
      <Line x1="29" y1="34" x2="22" y2="27" stroke={color} strokeWidth={1.8} />
      <Line x1="71" y1="34" x2="78" y2="27" stroke={color} strokeWidth={1.8} />
      {/* Horizon line */}
      <Line x1="5" y1="75" x2="95" y2="75" stroke={color} strokeWidth={1.5} opacity={0.6} />
      {/* Ground/hills */}
      <Path d="M5 75 Q25 65 50 75 Q75 85 95 75" stroke={color} strokeWidth={1.2} fill="none" opacity={0.4} />
      {/* Sparkles */}
      <Circle cx="88" cy="20" r="2" fill={color} opacity={0.7} />
      <Circle cx="15" cy="25" r="1.5" fill={color} opacity={0.5} />
      <Path d="M82 35 L86 35 M84 33 L84 37" stroke={color} strokeWidth={1} opacity={0.6} />
    </Svg>
  );
}

// Heart icon for Favorites
function HeartIcon({ color }: { color: string }) {
  return (
    <Svg width={50} height={50} viewBox="0 0 50 50">
      <Path
        d="M25 42 C15 32 5 24 5 16 C5 10 10 5 16 5 C20 5 23 7 25 10 C27 7 30 5 34 5 C40 5 45 10 45 16 C45 24 35 32 25 42 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

// Bookmark icon for Collections
function BookmarkIcon({ color }: { color: string }) {
  return (
    <Svg width={50} height={50} viewBox="0 0 50 50">
      <Path
        d="M12 5 L38 5 L38 45 L25 35 L12 45 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Sparkles */}
      <Circle cx="44" cy="12" r="1.5" fill={color} opacity={0.6} />
      <Path d="M42 20 L46 20 M44 18 L44 22" stroke={color} strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}

// Quill/Feather pen icon for My Affirmations
function QuillIcon({ color }: { color: string }) {
  return (
    <Svg width={50} height={50} viewBox="0 0 50 50">
      {/* Feather body */}
      <Path
        d="M40 5 C35 10 30 15 25 25 C22 32 20 38 18 45 L20 45 C22 40 25 35 30 28 C35 20 42 12 45 8 C43 6 41 5 40 5 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Feather details */}
      <Path d="M30 15 C28 18 26 22 24 28" stroke={color} strokeWidth={0.8} opacity={0.5} />
      <Path d="M35 12 C32 16 28 22 25 30" stroke={color} strokeWidth={0.8} opacity={0.4} />
      {/* Writing line */}
      <Line x1="10" y1="47" x2="30" y2="47" stroke={color} strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}

// Hourglass icon for History
function HourglassIcon({ color }: { color: string }) {
  return (
    <Svg width={50} height={50} viewBox="0 0 50 50">
      {/* Top part */}
      <Path
        d="M15 5 L35 5 L35 8 C35 15 28 20 25 22 C22 20 15 15 15 8 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Bottom part */}
      <Path
        d="M15 45 L35 45 L35 42 C35 35 28 30 25 28 C22 30 15 35 15 42 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Middle connection */}
      <Path d="M25 22 L25 28" stroke={color} strokeWidth={1.5} />
      {/* Sparkles */}
      <Circle cx="40" cy="10" r="1.5" fill={color} opacity={0.6} />
      <Circle cx="42" cy="25" r="1" fill={color} opacity={0.5} />
      <Path d="M38 18 L42 18 M40 16 L40 20" stroke={color} strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useCurrentTheme();
  const router = useRouter();

  // Theme-adaptive colors
  const cardBg = getCardBackground(theme);
  const cardText = getCardTextColor(theme);
  const premiumBannerBg = getPremiumBannerBg(theme);
  const remindersCardBg = getRemindersCardBg(theme);
  const remindersCardText = getRemindersCardTextColor(theme);

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
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
          }}
        >
          <Pressable
            onPress={() => router.back()}
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
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: theme.textColor,
              marginTop: 8,
              marginBottom: 20,
              fontStyle: 'italic',
            }}
          >
            Perfil
          </Text>

          {/* Premium Banner */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Pressable
              style={{
                backgroundColor: premiumBannerBg,
                borderRadius: 16,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                overflow: 'hidden',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: 6,
                  }}
                >
                  Desbloquear todo
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 18,
                  }}
                >
                  Accede a todas las categorias, afirmaciones,{'\n'}estilos y elimina anuncios!
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <CrownIllustration color="rgba(255,255,255,0.9)" />
              </View>
            </Pressable>
          </Animated.View>

          {/* Reminders and Alarm Cards Row */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            {/* Reminders Card */}
            <Animated.View entering={FadeInDown.delay(150).springify()} style={{ flex: 1 }}>
              <Pressable
                onPress={() => router.push('/reminders')}
                style={{
                  backgroundColor: remindersCardBg,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 140,
                }}
              >
                <View style={{ marginBottom: 8 }}>
                  <DigitalAlarmIcon color={remindersCardText} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: remindersCardText,
                    textAlign: 'center',
                  }}
                >
                  Recordatorios
                </Text>
              </Pressable>
            </Animated.View>

            {/* Alarm Card */}
            <Animated.View entering={FadeInDown.delay(200).springify()} style={{ flex: 1 }}>
              <Pressable
                onPress={() => router.push('/alarm')}
                style={{
                  backgroundColor: remindersCardBg,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 140,
                }}
              >
                <View style={{ marginBottom: 8 }}>
                  <SunriseAlarmIcon color={remindersCardText} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: remindersCardText,
                    textAlign: 'center',
                  }}
                >
                  Alarma Diaria
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* Personalize Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: theme.textColor,
              marginBottom: 16,
              fontStyle: 'italic',
            }}
          >
            Personaliza la app
          </Text>

          {/* Grid of 2 options */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* App Icon */}
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              style={{ flex: 1 }}
            >
              <Pressable
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  aspectRatio: 1,
                  justifyContent: 'center',
                }}
              >
                <View style={{ marginBottom: 12 }}>
                  <AffirmationCardsIcon color={cardText} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: cardText,
                    textAlign: 'center',
                  }}
                >
                  Icono de la app
                </Text>
              </Pressable>
            </Animated.View>

            {/* Notifications Bell */}
            <Animated.View
              entering={FadeInDown.delay(350).springify()}
              style={{ flex: 1 }}
            >
              <Pressable
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  aspectRatio: 1,
                  justifyContent: 'center',
                }}
              >
                <View style={{ marginBottom: 12 }}>
                  <BellIcon color={cardText} />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: cardText,
                    textAlign: 'center',
                  }}
                >
                  Notificaciones
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* Mi contenido Section */}
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: theme.textColor,
              marginTop: 24,
              marginBottom: 16,
              fontStyle: 'italic',
            }}
          >
            Mi contenido
          </Text>

          {/* Content Grid */}
          <View style={{ gap: 12 }}>
            {/* First Row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Favoritos */}
              <Animated.View
                entering={FadeInDown.delay(500).springify()}
                style={{ flex: 1 }}
              >
                <Pressable
                  onPress={() => router.push('/favorites')}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 80,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: cardText,
                    }}
                  >
                    Favoritos
                  </Text>
                  <HeartIcon color={cardText} />
                </Pressable>
              </Animated.View>

              {/* Colecciones */}
              <Animated.View
                entering={FadeInDown.delay(550).springify()}
                style={{ flex: 1 }}
              >
                <Pressable
                  onPress={() => router.push('/collections')}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 80,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: cardText,
                    }}
                  >
                    Colecciones
                  </Text>
                  <BookmarkIcon color={cardText} />
                </Pressable>
              </Animated.View>
            </View>

            {/* Second Row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {/* Mis afirmaciones */}
              <Animated.View
                entering={FadeInDown.delay(600).springify()}
                style={{ flex: 1 }}
              >
                <Pressable
                  onPress={() => router.push('/my-affirmations')}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 80,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: cardText,
                    }}
                  >
                    Mis{'\n'}afirmaciones
                  </Text>
                  <QuillIcon color={cardText} />
                </Pressable>
              </Animated.View>

              {/* Historial */}
              <Animated.View
                entering={FadeInDown.delay(650).springify()}
                style={{ flex: 1 }}
              >
                <Pressable
                  onPress={() => router.push('/history')}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 16,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 80,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: cardText,
                    }}
                  >
                    Historial
                  </Text>
                  <HourglassIcon color={cardText} />
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
