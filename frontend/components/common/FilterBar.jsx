import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * FilterBar Component
 * Horizontal filter tabs/buttons
 */
export default function FilterBar({ 
  filters, 
  activeFilter,
  onFilterChange,
  variant = 'tabs' // 'tabs' or 'chips'
}) {
  const isTab = variant === 'tabs';

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            isTab ? styles.tabButton : styles.chipButton,
            activeFilter === filter.id && (isTab ? styles.tabActive : styles.chipActive),
          ]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Text
            style={[
              isTab ? styles.tabText : styles.chipText,
              activeFilter === filter.id && (isTab ? styles.tabTextActive : styles.chipTextActive),
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  // Tab styles
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#ff9e6b',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#ff9e6b',
  },
  // Chip styles
  chipButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#ff9e6b',
    borderColor: '#ff9e6b',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  chipTextActive: {
    color: '#fff',
  },
});
