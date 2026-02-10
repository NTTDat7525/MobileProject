import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type BookingTabsProps = {
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
  style?: ViewStyle;
};

export default function BookingTabs({ activeTab, onTabChange, style }: BookingTabsProps) {
  return (
    <View style={[styles.tabsContainer, style]}>
      <TouchableOpacity
        style={[styles.tab1, activeTab === 'upcoming' && styles.tabActive]}
        onPress={() => onTabChange('upcoming')}
      >
        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
          Upcoming
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab2, activeTab === 'past' && styles.tabActive]}
        onPress={() => onTabChange('past')}
      >
        <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
          Past
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 1,
    paddingBottom: 3,
    paddingTop: 3,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dcdcdc',
  },
  tab1: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginLeft: 3,
  },
  tab2: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginRight: 3,
  },
  tabActive: {
    backgroundColor: '#f5e6cc',
    borderColor: '#f5e6cc',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    fontFamily: 'Arial',
  },
  tabTextActive: {
    color: '#333',
  },
});
