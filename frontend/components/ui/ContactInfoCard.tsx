import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type InfoRowData = {
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  iconSize?: number;
  label: string;
  value: string;
};

type ContactInfoCardProps = {
  items: InfoRowData[];
  style?: ViewStyle;
};

export default function ContactInfoCard({ items, style }: ContactInfoCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.cardTitle}>Contact Information</Text>
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.infoRow,
            index === items.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <View style={styles.iconBox}>
            <FontAwesome name={item.iconName} size={item.iconSize || 18} color="#333" />
          </View>
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 150,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
  },
  iconBox: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  label: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});
