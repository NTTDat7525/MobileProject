import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import UserHeader from '@/components/user/UserHeader';
import OrderCard from '@/components/user/OrderCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
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

      const userOrders = response.data.orders || [];
      setOrders(userOrders);
      filterOrders(userOrders, 'all');

      setStats({
        total: userOrders.length,
        paid: userOrders.filter((o) => o.paymentStatus === 'paid').length,
        unpaid: userOrders.filter(
          (o) => o.paymentStatus === 'unpaid' || o.paymentStatus === 'partial'
        ).length,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (data, filter) => {
    let filtered = data;

    if (filter === 'paid') {
      filtered = data.filter((o) => o.paymentStatus === 'paid');
    } else if (filter === 'unpaid') {
      filtered = data.filter(
        (o) => o.paymentStatus === 'unpaid' || o.paymentStatus === 'partial'
      );
    } else if (filter === 'completed') {
      filtered = data.filter((o) => o.status === 'completed');
    }

    setFilteredOrders(filtered);
    setActiveFilter(filter);
  };

  const filterOptions = [
    { id: 'all', label: 'All', icon: 'receipt', color: '#3b82f6' },
    { id: 'paid', label: 'Paid', icon: 'check-circle', color: '#10b981' },
    { id: 'unpaid', label: 'Unpaid', icon: 'alert-circle', color: '#ef4444' },
  ];

  return (
    <View style={styles.container}>
      <UserHeader title="My Orders" showBack />

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatBox label="Total" value={stats.total} color="#3b82f6" />
        <StatBox label="Paid" value={stats.paid} color="#10b981" />
        <StatBox label="Unpaid" value={stats.unpaid} color="#ef4444" />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterBtn,
              activeFilter === option.id && styles.filterBtnActive,
            ]}
            onPress={() => filterOrders(orders, option.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === option.id && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff9e6b"
          style={styles.loader}
        />
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="receipt-text-outline" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => <OrderCard order={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  filterBtnActive: {
    backgroundColor: '#ff9e6b',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
