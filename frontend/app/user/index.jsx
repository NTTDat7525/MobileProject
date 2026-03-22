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
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserHeader from '@/components/user/UserHeader';
import BookingCard from '@/components/user/BookingCard';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function UserHome() {
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
      setBookings(userBookings.slice(0, 3)); // Show latest 3

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
      <UserHeader
        title="Dashboard"
        rightAction={handleLogout}
        rightActionIcon="logout"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ff9e6b"
            style={styles.loader}
          />
        ) : (
          <>
            {/* Welcome */}
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.name}>{user?.displayName || 'Guest'}</Text>
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
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
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
                  onPress={() => router.push('/user/tables')}
                  color="#3b82f6"
                />
                <ActionButton
                  icon="history"
                  label="My Bookings"
                  onPress={() => router.push('/user/bookings')}
                  color="#8b5cf6"
                />
                <ActionButton
                  icon="receipt"
                  label="My Orders"
                  onPress={() => router.push('/user/orders')}
                  color="#10b981"
                />
              </View>
            </View>

            {/* Recent Bookings */}
            {bookings.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Bookings</Text>
                  <TouchableOpacity onPress={() => router.push('/user/bookings')}>
                    <Text style={styles.seeAll}>See all</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.bookingsList}>
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onPress={() => router.push(`/user/bookings/${booking._id}`)}
                      showCancel={false}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* User Info Card */}
            <View style={styles.section}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={20} color="#ff9e6b" />
                  <Text style={styles.infoText}>{user?.email}</Text>
                </View>
                {user?.phone && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone" size={20} color="#ff9e6b" />
                    <Text style={styles.infoText}>{user.phone}</Text>
                  </View>
                )}
                {user?.bio && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="information" size={20} color="#ff9e6b" />
                    <Text style={styles.infoText}>{user.bio}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push('/user/profile')}
              >
                <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatTile({ icon, label, value, color }) {
  return (
    <View style={[styles.statTile, { borderLeftColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color={color} style={styles.statIcon} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ActionButton({ icon, label, onPress, color }) {
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
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
  loader: {
    marginTop: 40,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ff9e6b',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAll: {
    fontSize: 13,
    color: '#ff9e6b',
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  bookingsList: {
    gap: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  editBtn: {
    backgroundColor: '#ff9e6b',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
