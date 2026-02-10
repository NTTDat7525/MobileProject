import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type GuestCounterProps = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  style?: ViewStyle;
};

export default function GuestCounter({ count, onIncrement, onDecrement, style }: GuestCounterProps) {
  return (
    <View style={[styles.guestControlContainer, style]}>
      <TouchableOpacity style={styles.circleButton} onPress={onDecrement}>
        <FontAwesome name="minus" size={18} color="#333" />
      </TouchableOpacity>

      <View style={styles.guestInfo}>
        <Text style={styles.guestNumber}>
          {count < 10 ? `0${count}` : count}
        </Text>
        <Text style={styles.guestLabel}>Guests</Text>
      </View>

      <TouchableOpacity style={styles.circleButton} onPress={onIncrement}>
        <FontAwesome name="plus" size={18} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  guestControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestInfo: {
    alignItems: 'center',
  },
  guestNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  guestLabel: {
    fontSize: 14,
    color: '#666',
  },
});
