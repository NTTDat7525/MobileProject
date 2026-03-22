import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="bookings" />
      <Stack.Screen
        name="bookings/[id]"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="bookings-create" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="tables" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
