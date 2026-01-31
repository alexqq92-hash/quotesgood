import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { QuoteFeed } from '@/components/QuoteFeed';
import { useCurrentTheme } from '@/lib/theme-store';

export default function QuotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useCurrentTheme();

  return (
    <View style={{ flex: 1 }}>
      <QuoteFeed />

      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
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
        }}
      >
        <ChevronLeft size={20} color={theme.iconColor} strokeWidth={2} />
      </Pressable>
    </View>
  );
}
