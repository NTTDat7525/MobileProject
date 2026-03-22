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
import BookingCard from '@/components/user/BookingCard';
import { router } from 'expo-router';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useFocusEffect(
    React.useCallback(() => {
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
      filterBookings(response.data.bookings || [], 'all');
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (data, filter) => {
    let filtered = data;

    if (filter === 'upcoming') {
      filtered = data.filter((b) => {
        const bookingDate = new Date(b.bookingDate);
        return bookingDate > new Date() && b.status !== 'cancelled';
      });
    } else if (filter === 'completed') {
      filtered = data.filter((b) => b.status === 'completed');
    } else if (filter === 'cancelled') {
      filtered = data.filter((b) => b.status === 'cancelled');
    }

    setFilteredBookings(filtered);
    setActiveFilter(filter);
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: async () => {
            await cancelBooking(bookingId);
          },
        },
      ]
    );
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(
        `${API_BASE}/users/bookings/${bookingId}/cancel`,
        { reason: 'User cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Booking cancelled');
      fetchBookings();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to cancel');
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <View style={styles.container}>
      <UserHeader title="My Bookings" showBack />

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
            onPress={() => filterBookings(bookings, option.id)}
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
      ) : filteredBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No bookings found</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/user/bookings-create')}
          >
            <Text style={styles.emptyBtnText}>Create a Booking</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={() => router.push(`/user/bookings/${item._id}`)}
              onCancel={() => handleCancelBooking(item._id)}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  emptyBtn: {
    backgroundColor: '#ff9e6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
