import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

type BookingDetailRowProps = {
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  iconFamily?: 'FontAwesome' | 'FontAwesome6';
  label: string;
  value: string;
  style?: ViewStyle;
};

export default function BookingDetailRow({ iconName, iconFamily = 'FontAwesome', label, value, style }: BookingDetailRowProps) {
  return (
    <View style={[styles.detailItem, style]}>
      {iconFamily === 'FontAwesome6' ? (
        <FontAwesome6 style={{ marginLeft: 5 }} name={iconName} size={20} color="#666" />
      ) : (
        <FontAwesome style={{ marginLeft: 5 }} name={iconName} size={20} color="#666" />
      )}
      <View>
        <Text style={styles.subLabel}>{label}</Text>
        <Text style={styles.infoText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailItem: {
    backgroundColor: '#fff',
    width: '95%',
    flexDirection: 'row',
    padding: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  subLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Arial',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
});
