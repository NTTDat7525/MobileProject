import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import UserHeader from '@/components/user/UserHeader';
import Button from '@/components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function BookingDetail() {
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/users/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      Alert.alert('Error', 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <UserHeader title="Booking Details" showBack />
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <UserHeader title="Booking Details" showBack />
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#10b981';
      case 'checked-in':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const bookingDate = new Date(booking.bookingDate);

  return (
    <View style={styles.container}>
      <UserHeader title="Booking Details" showBack />

      <ScrollView style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + '20' },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: getStatusColor(booking.status) }]}
                >
                  {booking.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <View>
              <Text style={styles.statusLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>#{booking._id?.slice(-6)}</Text>
            </View>
          </View>
        </View>

        {/* Booking Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Information</Text>

          <InfoRow
            icon="calendar"
            label="Date"
            value={bookingDate.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />

          <InfoRow
            icon="clock"
            label="Time"
            value={booking.checkInTime || 'TBD'}
          />

          <InfoRow
            icon="door"
            label="Duration"
            value={`${booking.estimatedDuration || 2} hours`}
          />

          <InfoRow
            icon="users"
            label="Guests"
            value={`${booking.numberOfGuests} people`}
          />
        </View>

        {/* Table Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table Information</Text>

          <InfoRow
            icon="table-furniture"
            label="Table"
            value={booking.table?.tableNumber ? `Table ${booking.table.tableNumber}` : 'TBD'}
          />

          <InfoRow
            icon="chair-rolling"
            label="Capacity"
            value={booking.table?.capacity ? `${booking.table.capacity} guests` : 'TBD'}
          />

          <InfoRow
            icon="map-marker"
            label="Location"
            value={booking.table?.location || 'TBD'}
          />

          <InfoRow
            icon="home"
            label="Type"
            value={booking.table?.type || 'TBD'}
          />
        </View>

        {/* Guest Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>

          <InfoRow
            icon="account"
            label="Name"
            value={booking.guestName}
          />

          <InfoRow
            icon="email"
            label="Email"
            value={booking.guestEmail}
          />

          <InfoRow
            icon="phone"
            label="Phone"
            value={booking.guestPhone}
          />
        </View>

        {/* Special Requests */}
        {booking.specialRequests && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Requests</Text>
            <Text style={styles.requestText}>{booking.specialRequests}</Text>
          </View>
        )}

        {/* Occasion */}
        {booking.occasion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Occasion</Text>
            <Text style={styles.occasionText}>
              {booking.occasion.charAt(0).toUpperCase() + booking.occasion.slice(1)}
            </Text>
          </View>
        )}

        {/* Actions */}
        {booking.status === 'pending' || booking.status === 'confirmed' ? (
          <View style={styles.actions}>
            <Button
              title="Edit Booking"
              onPress={() => console.log('Edit booking')}
              style={styles.editBtn}
            />
            <Button
              title="Cancel Booking"
              onPress={() => console.log('Cancel booking')}
              style={styles.cancelBtn}
              textStyle={styles.cancelText}
            />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={18} color="#ff9e6b" style={styles.icon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  icon: {
    marginRight: 12,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  requestText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  occasionText: {
    fontSize: 13,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
    marginBottom: 40,
  },
  editBtn: {
    flex: 1,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fee2e2',
  },
  cancelText: {
    color: '#ef4444',
  },
});
