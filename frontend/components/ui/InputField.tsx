import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type InputFieldProps = {
  label: string;
  placeholder: string;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  secureTextEntry?: boolean;
  style?: ViewStyle;
};

export default function InputField({ label, placeholder, iconName, secureTextEntry = false, style }: InputFieldProps) {
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <FontAwesome name={iconName} size={18} color="#999" />
        <TextInput
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
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
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
});
