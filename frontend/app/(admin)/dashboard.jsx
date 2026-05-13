import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PieChart } from 'react-native-chart-kit';

import { getTableStatus } from '@/src/services/table.service';
import { signout } from '@/src/services/auth.service';
import useAuthStore from '@/src/store/authStore';

import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await getTableStatus();
      setStats(res.data?.summary ?? null);
    } catch {}
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    try { await signout(); } catch {}
    await logout();
    router.replace('/(auth)/signin');
  };

  const total = stats?.total ?? 0;
  const inUse = stats?.inUse ?? 0;

  const chartData = [
    {
      name: 'Có sẵn',
      population: stats?.available ?? 0,
      color: '#22c55e',
    },
    {
      name: 'Đang dùng',
      population: stats?.inUse ?? 0,
      color: '#3b82f6',
    },
    {
      name: 'Đã đặt',
      population: stats?.booked ?? 0,
      color: '#f59e0b',
    },
    {
      name: 'Bảo trì',
      population: stats?.maintenance ?? 0,
      color: '#ef4444',
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>Xin chào</Text>
            <Text style={styles.name}>{user?.username}</Text>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.highlight}>
          <Text style={styles.highlightText}>
            {inUse}/{total} bàn đang sử dụng
          </Text>
        </View>

        <Text style={styles.section}>Biểu đồ trạng thái</Text>

        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={180}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          chartConfig={{
            color: () => `#000`,
          }}
          absolute
        />

        <Text style={styles.section}>Tổng quan</Text>

        <View style={styles.grid}>
          <Stat icon="grid-outline" label="Tổng" value={total} />
          <Stat icon="checkmark-circle" label="Có sẵn" value={stats?.available} />
          <Stat icon="time" label="Đang dùng" value={stats?.inUse} />
          <Stat icon="calendar" label="Đã đặt" value={stats?.booked} />
        </View>

        <Text style={styles.section}>Thao tác nhanh</Text>

        <Quick
          icon="restaurant"
          label="Quản lý bàn"
          onPress={() => router.push('/(admin)/tables')}
        />

        <Quick
          icon="calendar"
          label="Quản lý đặt bàn"
          onPress={() => router.push('/(admin)/bookings')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, label, value }) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={22} color="#333" />
      <Text style={styles.value}>{value ?? 0}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function Quick({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quick} onPress={onPress}>
      <Ionicons name={icon} size={22} />
      <Text style={styles.quickText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  greet: { color: '#888' },
  name: { fontSize: 20, fontWeight: 'bold' },

  highlight: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  highlightText: { color: '#fff', fontSize: 16 },

  section: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  label: { color: '#666' },

  quick: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  quickText: {
    marginLeft: 10,
    fontWeight: '500',
  },
});