import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Input({ 
    label, 
    placeholder, 
    iconName, 
    secureTextEntry = false, 
    style, 
    value, 
    onChangeText,
    editable = true }) {
  return (
    <View>
        <View style={style}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputBox, !editable && styles.inputBoxDisabled]}>
            <FontAwesome name={iconName} size={18} color={editable ? '#007AFF' : '#ccc'} />
            <TextInput
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            style={[styles.input, !editable && styles.inputDisabled]}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            />
        </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
  },
  inputBoxDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  inputDisabled: {
    color: '#999',
  },
  inputBoxFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    fontSize: 15,
  },
});