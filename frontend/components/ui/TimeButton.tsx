import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type TimeButtonProps = {
  time: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function TimeButton({ time, selected, onPress, style }: TimeButtonProps) {
  return (
    <TouchableOpacity style={[styles.timeButton, style]} onPress={onPress}>
      <Text style={styles.timeText}>{time}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
});
