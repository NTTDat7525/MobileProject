import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="tables" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="foods" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="revenue" />
    </Stack>
  );
}
