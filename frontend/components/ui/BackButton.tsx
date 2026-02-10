import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type BackButtonProps = {
  onPress: () => void;
  style?: ViewStyle;
};

export default function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <TouchableOpacity style={[styles.backButton, style]} onPress={onPress}>
      <FontAwesome name="arrow-left" size={20} color="#333" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 15,
    padding: 0,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
