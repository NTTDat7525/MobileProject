import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BookingCard from '@/components/user/BookingCard';
import ActionButton from '@/components/common/ActionButton';
import Card from '@/components/common/Card';
import SectionHeader from '@/components/common/SectionHeader';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE}/users/me`, { headers }),
        axios.get(`${API_BASE}/users/bookings`, { headers }),
      ]);

      setUser(userRes.data.user);

      const userBookings = bookingsRes.data.bookings || [];
      setBookings(userBookings.slice(0, 3));

      const now = new Date();
      const upcoming = userBookings.filter((b) => new Date(b.bookingDate) > now);
      const completed = userBookings.filter((b) => b.status === 'completed');

      setStats({
        totalBookings: userBookings.length,
        upcomingBookings: upcoming.length,
        completedBookings: completed.length,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          router.replace('/screens/Signin');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Welcome back!</Text>
                <Text style={styles.name}>{user?.displayName || 'Guest'}</Text>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <StatTile
                icon="calendar-check"
                label="Upcoming"
                value={stats.upcomingBookings}
                color="#3b82f6"
              />
              <StatTile
                icon="check-all"
                label="Completed"
                value={stats.completedBookings}
                color="#10b981"
              />
              <StatTile
                icon="book-multiple"
                label="Total"
                value={stats.totalBookings}
                color="#f59e0b"
              />
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <SectionHeader title="Quick Actions" />
              <View style={styles.actionGrid}>
                <ActionButton
                  icon="plus-circle"
                  label="New Booking"
                  onPress={() => router.push('/user/bookings-create')}
                  color="#ff9e6b"
                />
                <ActionButton
                  icon="table-furniture"
                  label="Browse Tables"
                  onPress={() => router.push('/(tabs)/browse')}
                  color="#3b82f6"
                />
                <ActionButton
                  icon="history"
                  label="My Bookings"
                  onPress={() => router.push('/(tabs)/bookings')}
                  color="#8b5cf6"
                />
                <ActionButton
                  icon="receipt"
                  label="My Orders"
                  onPress={() => router.push('/(tabs)/orders')}
                  color="#10b981"
                />
              </View>
            </View>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Bookings</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
                    <Text style={styles.seeAll}>See all</Text>
                  </TouchableOpacity>
                </View>
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onPress={() => router.push(`/user/bookings/${booking._id}`)}
                    showCancel={false}
                  />
                ))}
              </View>
            )}

            {/* User Info Card */}
            <View style={styles.section}>
              <Card style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={18} color="#ff9e6b" />
                  <Text style={styles.infoText}>{user?.email}</Text>
                </View>
                {user?.phone && (
                  <View style={[styles.infoRow, styles.infoRowBorder]}>
                    <MaterialCommunityIcons name="phone" size={18} color="#ff9e6b" />
                    <Text style={styles.infoText}>{user.phone}</Text>
                  </View>
                )}
                {user?.bio && (
                  <View style={[styles.infoRow, styles.infoRowBorder]}>
                    <MaterialCommunityIcons name="information" size={18} color="#ff9e6b" />
                    <Text style={styles.infoText}>{user.bio}</Text>
                  </View>
                )}
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatTile({ icon, label, value, color }) {
  return (
    <Card style={[styles.statTile, { borderLeftWidth: 3, borderLeftColor: color }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#9ca3af',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  statTile: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 12,
    color: '#ff9e6b',
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  infoCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
  },
});