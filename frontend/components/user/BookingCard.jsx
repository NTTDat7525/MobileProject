import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookingCard({ booking, onPress, onCancel, showCancel = true }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#10b981';
      case 'checked-in':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const bookingDate = new Date(booking.bookingDate);
  const isPast = bookingDate < new Date();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="calendar" size={20} color="#ff9e6b" />
          <View style={styles.headerInfo}>
            <Text style={styles.date}>
              {bookingDate.toLocaleDateString('vi-VN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.time}>
              {booking.checkInTime || 'TBD'}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="table-furniture" size={16} color="#9ca3af" />
          <Text style={styles.detailText}>
            Table {booking.tableId?.tableNumber} • {booking.numberOfGuests} guests
          </Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account" size={16} color="#9ca3af" />
          <Text style={styles.detailText}>{booking.guestName}</Text>
        </View>

        {booking.occasion && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="party-popper" size={16} color="#9ca3af" />
            <Text style={styles.detailText}>{booking.occasion}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.bookingId}>#{booking._id?.slice(-6) || '...'}</Text>
        </View>

        {showCancel && !isPast && (booking.status === 'pending' || booking.status === 'confirmed') && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            <MaterialCommunityIcons name="close" size={16} color="#ef4444" />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerInfo: {
    gap: 2,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  time: {
    fontSize: 11,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    gap: 4,
  },
  bookingId: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    gap: 4,
  },
  cancelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ef4444',
  },
});
