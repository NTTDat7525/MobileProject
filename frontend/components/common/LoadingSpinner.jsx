import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */
export default function LoadingSpinner({ 
  size = 'large', 
  color = '#ff9e6b',
  fullScreen = false
}) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return <ActivityIndicator size={size} color={color} />;
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
});
