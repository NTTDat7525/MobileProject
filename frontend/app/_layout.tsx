import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="screens/Confirm" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Confirmed" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Signin" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Signup" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Detail" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Booking" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Main" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
