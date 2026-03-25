import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{headerShown : false}}/>
      <Stack.Screen name="bookings" options={{headerShown : false}}/>
      <Stack.Screen
        name="bookings/[id]"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="bookings-create" options={{headerShown : false}}/>
      <Stack.Screen name="orders" options={{headerShown : false}}/>
      <Stack.Screen name="tables" options={{headerShown : false}}/>
      <Stack.Screen name="profile" options={{headerShown : false}}/>
    </Stack>
  );
}
