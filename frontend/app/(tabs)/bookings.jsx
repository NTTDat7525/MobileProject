import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FilterBar from '@/components/common/FilterBar';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BookingCard from '@/components/user/BookingCard';
import SectionHeader from '@/components/common/SectionHeader';
import Card from '@/components/common/Card';

const API_BASE = 'http://192.168.1.9:5001/api';

const BOOKING_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/users/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    if (activeFilter === 'all') return bookings;

    const now = new Date();
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      switch (activeFilter) {
        case 'upcoming':
          return bookingDate > now && booking.status !== 'cancelled';
        case 'completed':
          return booking.status === 'completed';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', onPress: () => {} },
        {
          text: 'Yes, Cancel',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              await axios.put(
                `${API_BASE}/users/bookings/${bookingId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchBookings();
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const filteredBookings = getFilteredBookings();

  const renderBookingItem = ({ item }) => (
    <BookingCard
      booking={item}
      onPress={() => router.push(`/user/bookings/${item._id}`)}
      onCancel={() => handleCancelBooking(item._id)}
      showCancel={item.status === 'pending' || item.status === 'confirmed'}
    />
  );

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
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your reservations</Text>
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            {/* Filters */}
            <View style={styles.filterSection}>
              <FilterBar
                filters={BOOKING_FILTERS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                variant="tabs"
              />
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatBox
                label="Total"
                value={bookings.length}
                color="#ff9e6b"
              />
              <StatBox
                label="Upcoming"
                value={bookings.filter(
                  (b) => new Date(b.bookingDate) > new Date() && b.status !== 'cancelled'
                ).length}
                color="#3b82f6"
              />
              <StatBox
                label="Completed"
                value={bookings.filter((b) => b.status === 'completed').length}
                color="#10b981"
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-x"
            title="No Bookings"
            message="You don't have any booking in this category yet"
            color="#9ca3af"
          />
        }
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />

      {/* Create Booking Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/user/bookings-create')}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function StatBox({ label, value, color }) {
  return (
    <Card style={[styles.statBox, { borderLeftWidth: 3, borderLeftColor: color }]}>
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
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff9e6b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
