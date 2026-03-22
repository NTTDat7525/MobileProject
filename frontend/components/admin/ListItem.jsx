import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ListItem({
  title,
  subtitle,
  status,
  onPress,
  onEdit,
  onDelete,
  rightContent,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
      case 'completed':
      case 'paid':
        return '#10b981';
      case 'occupied':
      case 'pending':
      case 'preparing':
        return '#f59e0b';
      case 'reserved':
      case 'unpaid':
        return '#3b82f6';
      case 'maintenance':
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {status && (
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(status) + '20' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(status) }]}
          >
            {status}
          </Text>
        </View>
      )}

      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}

      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rightContent: {
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 4,
  },
});
