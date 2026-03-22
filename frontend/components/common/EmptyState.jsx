import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * EmptyState Component
 * Displays when no data is available
 */
export default function EmptyState({ 
  icon = 'inbox', 
  title = 'No Data', 
  message = 'Nothing to show here',
  color = '#9ca3af'
}) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name={icon} 
        size={48} 
        color={color}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 12,
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
