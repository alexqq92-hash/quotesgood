import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { BottomTabBar } from '@/components/BottomTabBar';
import { View } from 'react-native';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_500Medium, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { preloadCategoryImages } from '@/lib/preloadCategoryImages';
import { initNotificationListener, scheduleNotifications } from '@/lib/notifications';
import { initAlarmListener, scheduleAlarm } from '@/lib/alarm-notifications';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });
  // Preload category images in background (non-blocking)
  useEffect(() => {
    preloadCategoryImages().catch(() => {});
  }, []);

  // Initialize notification listener
  useEffect(() => {
    initNotificationListener();
    scheduleNotifications();
    initAlarmListener();
    scheduleAlarm();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 200,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="categories" />
          <Stack.Screen name="styles" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="profile" />
          <Stack.Screen
            name="favorites"
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="saved"
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="reminders"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="alarm"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="quotes"
            options={{
              animation: 'fade',
            }}
          />
        </Stack>
        <BottomTabBar />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
