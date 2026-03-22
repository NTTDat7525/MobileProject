import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OrderCard({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'preparing':
        return '#f59e0b';
      case 'ready':
      case 'served':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid':
        return '#10b981';
      case 'unpaid':
        return '#ef4444';
      case 'partial':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.date}>
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
            <Text style={[styles.badgeText, { color: getStatusColor(order.status) }]}>
              {order.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clipboard-list" size={16} color="#9ca3af" />
          <Text style={styles.detailText}>
            {order.items?.length || 0} items
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="table-furniture" size={16} color="#9ca3af" />
          <Text style={styles.detailText}>
            Table {order.tableId?.tableNumber || '-'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal:</Text>
            <Text style={styles.priceValue}>₫{order.subtotal?.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total:</Text>
            <Text style={styles.totalValue}>₫{order.totalAmount?.toLocaleString()}</Text>
          </View>
        </View>

        <View style={[styles.paymentBadge, { backgroundColor: getPaymentColor(order.paymentStatus) + '20' }]}>
          <Text style={[styles.paymentText, { color: getPaymentColor(order.paymentStatus) }]}>
            {order.paymentStatus}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    gap: 4,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  date: {
    fontSize: 11,
    color: '#9ca3af',
  },
  headerRight: {
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceInfo: {
    gap: 4,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  priceValue: {
    fontSize: 12,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff9e6b',
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  paymentText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
