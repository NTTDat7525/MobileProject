import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type DateCardData = {
  day: string;
  date: string;
  month: string;
};

type DateCardProps = {
  item: DateCardData;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function DateCard({ item, selected, onPress, style }: DateCardProps) {
  return (
    <TouchableOpacity style={[styles.dateCard, style]} onPress={onPress}>
      <Text style={styles.dateDay}>{item.day}</Text>
      <Text style={styles.dateNum}>{item.date}</Text>
      <Text style={styles.dateMonth}>{item.month}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    width: 70,
    height: 90,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  dateDay: { fontSize: 12, color: '#666' },
  dateNum: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 2 },
  dateMonth: { fontSize: 12, color: '#666' },
});
