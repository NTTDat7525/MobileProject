import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Card Component
 * Generic card wrapper for content
 */
export default function Card({ 
  children, 
  style,
  padding = 16,
  gap = 0
}) {
  return (
    <View 
      style={[
        styles.card,
        { padding, gap },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
