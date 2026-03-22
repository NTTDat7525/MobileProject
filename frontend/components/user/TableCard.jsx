import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TableCard({ table, onPress, onSelect, isSelected }) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="table-furniture" size={20} color="#ff9e6b" />
          <Text style={styles.title}>Table {table.tableNumber}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor(table.status) + '20' }]}>
          <Text style={[styles.badgeText, { color: getStatusColor(table.status) }]}>
            {table.status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Capacity</Text>
          <Text style={styles.detailValue}>{table.capacity} guests</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>{table.type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{table.location}</Text>
        </View>
      </View>

      {table.features && (
        <View style={styles.features}>
          {table.features.hasWindow && (
            <View style={styles.featureBadge}>
              <MaterialCommunityIcons name="window-closed" size={14} color="#3b82f6" />
              <Text style={styles.featureText}>Window View</Text>
            </View>
          )}
          {table.features.wheelchair && (
            <View style={styles.featureBadge}>
              <MaterialCommunityIcons name="wheelchair-accessibility" size={14} color="#3b82f6" />
              <Text style={styles.featureText}>Wheelchair</Text>
            </View>
          )}
        </View>
      )}

      {onSelect && (
        <TouchableOpacity
          style={[styles.selectBtn, isSelected && styles.selectBtnActive]}
          onPress={() => onSelect(table._id)}
        >
          <MaterialCommunityIcons
            name={isSelected ? 'check-circle' : 'circle-outline'}
            size={20}
            color={isSelected ? '#10b981' : '#d1d5db'}
          />
          <Text style={[styles.selectText, isSelected && styles.selectTextActive]}>
            {isSelected ? 'Selected' : 'Select'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'available':
      return '#10b981';
    case 'occupied':
      return '#f59e0b';
    case 'reserved':
      return '#3b82f6';
    case 'maintenance':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#ff9e6b',
    backgroundColor: '#fff9f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  featureText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '500',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  selectBtnActive: {
    backgroundColor: '#dcfce7',
  },
  selectText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectTextActive: {
    color: '#10b981',
  },
});
