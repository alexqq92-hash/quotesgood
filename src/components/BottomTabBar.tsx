import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Grid3X3, Palette, Sparkles } from 'lucide-react-native';
import { useCurrentTheme } from '@/lib/theme-store';

type TabRoute = '/' | '/categories' | '/styles';

interface TabItem {
  route: TabRoute;
  label: string;
  icon: typeof Settings;
}

const tabs: TabItem[] = [
  { route: '/', label: 'Home', icon: Sparkles },
  { route: '/categories', label: 'Categories', icon: Grid3X3 },
  { route: '/styles', label: 'Styles', icon: Palette },
];

interface BottomTabBarProps {
  embedded?: boolean;
}

export function BottomTabBar({ embedded = false }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const theme = useCurrentTheme();

  const handlePress = (route: TabRoute) => {
    router.push(route);
  };

  // Don't show on favorites screen
  if (pathname === '/favorites') {
    return null;
  }

  return (
    <View
      style={[
        embedded ? styles.containerEmbedded : styles.container,
        !embedded && { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.route ||
            (tab.route === '/' && pathname.startsWith('/?'));
          const Icon = tab.icon;

          return (
            <Pressable
              key={tab.route}
              onPress={() => handlePress(tab.route)}
              style={styles.tabItem}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive
                      ? theme.accentColor
                      : 'rgba(255,255,255,0.35)',
                  },
                ]}
              >
                <Icon
                  size={20}
                  color={isActive ? '#fff' : theme.iconColor}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isActive ? '#fff' : theme.iconColor,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 9999,
    elevation: 9999,
  },
  containerEmbedded: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
  },
  label: {
    fontSize: 13,
  },
});
