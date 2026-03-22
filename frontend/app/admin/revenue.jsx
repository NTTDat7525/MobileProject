import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function RevenueScreen() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    paidOrders: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${API_BASE}/admin/orders/stats?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₫${(value / 1000000).toFixed(2)}M`;
  };

  const periodOptions = ['day', 'week', 'month'];

  return (
    <View style={styles.container}>
      <AdminHeader title="Revenue" onFilter={() => {}} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periodOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.periodBtn,
                period === opt && styles.periodBtnActive,
              ]}
              onPress={() => setPeriod(opt)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === opt && styles.periodTextActive,
                ]}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ff9e6b"
            style={styles.loader}
          />
        ) : (
          <>
            {/* Revenue Stats */}
            <View style={styles.statsSection}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={(props) => (
                  <MaterialCommunityIcons name="currency-usd" {...props} />
                )}
                color="#10b981"
              />

              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={(props) => (
                  <MaterialCommunityIcons name="clipboard-list" {...props} />
                )}
                color="#3b82f6"
              />

              <StatCard
                title="Completed Orders"
                value={stats.completedOrders}
                icon={(props) => (
                  <MaterialCommunityIcons name="check-circle" {...props} />
                )}
                color="#8b5cf6"
              />

              <StatCard
                title="Paid Orders"
                value={stats.paidOrders}
                icon={(props) => (
                  <MaterialCommunityIcons name="credit-card" {...props} />
                )}
                color="#06b6d4"
              />

              <StatCard
                title="Cancelled Orders"
                value={stats.cancelledOrders}
                icon={(props) => (
                  <MaterialCommunityIcons name="cancel" {...props} />
                )}
                color="#ef4444"
              />

              <StatCard
                title="Average Order Value"
                value={formatCurrency(stats.avgOrderValue)}
                icon={(props) => (
                  <MaterialCommunityIcons name="chart-line" {...props} />
                )}
                color="#f59e0b"
              />
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Success Rate</Text>
                  <Text style={styles.summaryValue}>
                    {stats.totalOrders > 0
                      ? (
                        ((stats.completedOrders + stats.paidOrders) /
                          stats.totalOrders) *
                        100
                      ).toFixed(1)
                      : 0}
                    %
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Cancellation Rate</Text>
                  <Text style={styles.summaryValue}>
                    {stats.totalOrders > 0
                      ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(
                        1
                      )
                      : 0}
                    %
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  periodBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  periodBtnActive: {
    backgroundColor: '#ff9e6b',
  },
  periodText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 12,
  },
  periodTextActive: {
    color: '#fff',
  },
  loader: {
    marginTop: 40,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9e6b',
  },
});
