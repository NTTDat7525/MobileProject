import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatCard from '@/components/admin/StatCard';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    availableTables: 0,
    totalTables: 0,
    completedOrders: 0,
    paidOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [revenueRes, tablesRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/revenue`, { headers }),
        axios.get(`${API_BASE}/admin/tables/status`, { headers }),
        axios.get(`${API_BASE}/admin/orders/stats`, { headers }),
      ]);

      setStats({
        totalRevenue: revenueRes.data.totalRevenue || 0,
        totalOrders: revenueRes.data.totalOrders || 0,
        availableTables:
          revenueRes.data.summary?.available || 0,
        totalTables: tablesRes.data.summary?.total || 0,
        completedOrders: ordersRes.data.completedOrders || 0,
        paidOrders: ordersRes.data.paidOrders || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Tables',
      subtitle: 'Manage restaurant tables',
      icon: 'table-furniture',
      route: '/admin/tables',
      color: '#3b82f6',
    },
    {
      id: 2,
      title: 'Orders',
      subtitle: 'View and manage orders',
      icon: 'clipboard-list',
      route: '/admin/orders',
      color: '#10b981',
    },
    {
      id: 3,
      title: 'Foods',
      subtitle: 'Manage menu items',
      icon: 'silverware-fork-knife',
      route: '/admin/foods',
      color: '#f59e0b',
    },
    {
      id: 4,
      title: 'Bookings',
      subtitle: 'Manage reservations',
      icon: 'calendar-check',
      route: '/admin/bookings',
      color: '#8b5cf6',
    },
    {
      id: 5,
      title: 'Revenue',
      subtitle: 'View financial reports',
      icon: 'chart-box',
      route: '/admin/revenue',
      color: '#ef4444',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Admin Panel</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>

      {/* Stats */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      ) : (
        <View style={styles.statsSection}>
          <StatCard
            title="Total Revenue"
            value={`₫${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon={(props) => (
              <MaterialCommunityIcons name="currency-usd" {...props} />
            )}
            color="#10b981"
          />
          <StatCard
            title="Available Tables"
            value={`${stats.availableTables}/${stats.totalTables}`}
            icon={(props) => (
              <MaterialCommunityIcons name="table-furniture" {...props} />
            )}
            color="#3b82f6"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={(props) => (
              <MaterialCommunityIcons name="clipboard-list" {...props} />
            )}
            color="#f59e0b"
          />
          <StatCard
            title="Paid Orders"
            value={stats.paidOrders}
            icon={(props) => (
              <MaterialCommunityIcons name="check-circle" {...props} />
            )}
            color="#8b5cf6"
          />
        </View>
      )}

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => router.push(item.route)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color={item.color}
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshBtn}
        onPress={fetchDashboardData}
      >
        <MaterialCommunityIcons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshText}>Refresh Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ff9e6b',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  loader: {
    marginVertical: 40,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  refreshBtn: {
    marginHorizontal: 16,
    marginBottom: 30,
    backgroundColor: '#ff9e6b',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
