import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

type SearchBoxProps = {
  placeholder?: string;
  iconType?: 'ionicons' | 'fontawesome';
  style?: ViewStyle;
};

export default function SearchBox({ placeholder = 'Search', iconType = 'ionicons', style }: SearchBoxProps) {
  return (
    <View style={[styles.searchBox, style]}>
      {iconType === 'ionicons' ? (
        <Ionicons name="search-outline" size={20} color="#999" />
      ) : (
        <FontAwesome name="search" size={20} color="#999" />
      )}
      <TextInput placeholder={placeholder} style={styles.searchInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
});
