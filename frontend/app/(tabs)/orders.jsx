import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import FilterBar from '@/components/common/FilterBar';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OrderCard from '@/components/user/OrderCard';
import SectionHeader from '@/components/common/SectionHeader';
import Card from '@/components/common/Card';

const API_BASE = 'http://192.168.1.9:5001/api';

const PAYMENT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'unpaid', label: 'Unpaid' },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/users/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (activeFilter === 'all') return orders;
    return orders.filter((order) => {
      if (activeFilter === 'paid') return order.paymentStatus === 'paid';
      if (activeFilter === 'unpaid') return order.paymentStatus !== 'paid';
      return true;
    });
  };

  const getStats = () => {
    const total = orders.length;
    const paid = orders.filter((o) => o.paymentStatus === 'paid').length;
    const unpaid = total - paid;

    return { total, paid, unpaid };
  };

  const filteredOrders = getFilteredOrders();
  const stats = getStats();

  const renderOrderItem = ({ item }) => <OrderCard order={item} />;

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner fullScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>View your orders and payments</Text>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            {/* Stats */}
            <View style={styles.statsGrid}>
              <StatCard label="Total Orders" value={stats.total} color="#ff9e6b" />
              <StatCard label="Paid" value={stats.paid} color="#10b981" />
              <StatCard label="Unpaid" value={stats.unpaid} color="#ef4444" />
            </View>

            {/* Filters */}
            <View style={styles.filterSection}>
              <SectionHeader title="Filter by Payment Status" />
              <FilterBar
                filters={PAYMENT_FILTERS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                variant="tabs"
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-text-minus"
            title="No Orders"
            message="You haven't placed any orders yet"
            color="#9ca3af"
          />
        }
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function StatCard({ label, value, color }) {
  return (
    <Card style={[styles.statCard, { borderTopWidth: 3, borderTopColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
