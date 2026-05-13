import React, { useState, useCallback } from 'react';
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
          <Ionicons name="restaurant-outline" size={24} color={Colors.white} />
          <Text style={styles.highlightText}>
            {inUse}/{total} bàn đang sử dụng
          </Text>
          <Text style={styles.highlightSub}>Theo dõi trạng thái vận hành trong ngày</Text>
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
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>
      <Text style={styles.value}>{value ?? 0}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function Quick({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quick} onPress={onPress}>
      <Ionicons name={icon} size={22} color={Colors.primary} />
      <Text style={styles.quickText}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },

  greet: { color: Colors.textSecondary, fontSize: FontSize.sm },
  name: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.text },

  highlight: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },

  highlightText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginTop: Spacing.sm },
  highlightSub: { color: Colors.primaryLight, fontSize: FontSize.sm, marginTop: Spacing.xs },

  section: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  card: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryLight },

  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
    marginTop: Spacing.xs,
  },

  label: { color: Colors.textSecondary, fontSize: FontSize.sm },

  quick: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  quickText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
});
