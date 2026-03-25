import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{headerShown : false}}/>
      <Stack.Screen name="tables" options={{headerShown : false}}/>
      <Stack.Screen name="orders" options={{headerShown : false}}/>
      <Stack.Screen name="foods" options={{headerShown : false}}/>
      <Stack.Screen name="bookings" options={{headerShown : false}}/>
      <Stack.Screen name="revenue" options={{headerShown : false}}/>
    </Stack>
  );
}
