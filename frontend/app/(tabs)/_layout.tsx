import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: 'Upcoming',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="clock-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="user-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: 'Detail',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="eye" color={color} />,
        }}
      />
      <Tabs.Screen
        name="past"
        options={{
          title: 'Past',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="confirm"
        options={{
          title: 'Confirm',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="check-circle" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="confirmed"
        options={{
          title: 'Confirmed',
          tabBarIcon: ({ color }) => <FontAwesome size={20} name="check-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
