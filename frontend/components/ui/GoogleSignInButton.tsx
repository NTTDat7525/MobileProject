import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type GoogleSignInButtonProps = {
  onPress?: () => void;
  style?: ViewStyle;
};

export default function GoogleSignInButton({ onPress, style }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity style={[styles.googleButton, style]} onPress={onPress}>
      <Text style={styles.googleText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleText: {
    fontSize: 15,
    color: '#333',
  },
});
