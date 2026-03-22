import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Badge Component
 * Display status or category tags
 */
export default function Badge({ 
  label, 
  variant = 'default',
  size = 'md'
}) {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'warning':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'danger':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'info':
        return { bg: '#dbeafe', text: '#0c4a6e' };
      case 'pending':
        return { bg: '#fef08a', text: '#b45309' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 };
      case 'lg':
        return { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 };
      default:
        return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 };
    }
  };

  const colors = getColors();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.bg,
        ...sizeStyles
      }
    ]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
