import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SectionHeader Component
 * Section title with optional action button
 */
export default function SectionHeader({ 
  title, 
  subtitle,
  rightElement,
  size = 'md'
}) {
  const getTitleSize = () => {
    switch (size) {
      case 'sm':
        return 13;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, { fontSize: getTitleSize() }]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
