import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * ActionButton Component
 * Small reusable action button with icon
 */
export default function ActionButton({ 
  icon, 
  label, 
  onPress,
  color = '#ff9e6b',
  disabled = false,
  size = 'md'
}) {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return { container: 60, icon: 24, text: 11 };
      case 'lg':
        return { container: 100, icon: 32, text: 14 };
      default:
        return { container: 80, icon: 28, text: 12 };
    }
  };

  const sizes = getSize();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.iconContainer,
          { 
            width: sizes.container,
            height: sizes.container,
            backgroundColor: color + '20',
            opacity: disabled ? 0.5 : 1
          }
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={sizes.icon}
          color={color}
        />
      </View>
      <Text 
        style={[
          styles.label,
          { fontSize: sizes.text, color: disabled ? '#d1d5db' : '#1f2937' }
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
