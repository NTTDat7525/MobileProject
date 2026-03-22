import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ title, value, icon: Icon, color = '#ff9e6b' }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        {Icon && <Icon size={24} color={color} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
