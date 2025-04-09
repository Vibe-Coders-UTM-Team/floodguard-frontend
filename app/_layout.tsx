import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayoutNav() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}