import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type BookingData = {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  guests: string;
  bookingID: string;
};

type BookingCardProps = {
  booking: BookingData;
  variant: 'upcoming' | 'past';
  onEdit?: () => void;
  onCancel?: () => void;
  onBookAgain?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
};

export default function BookingCard({ booking, variant, onEdit, onCancel, onBookAgain, onDelete, style }: BookingCardProps) {
  return (
    <View style={[styles.bookingCard, style]}>
      <View style={styles.cardTop}>
        <View style={styles.restaurantImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.resName}>{booking.name}</Text>
          <Text style={styles.resType}>{booking.type}</Text>
          <View style={styles.detailsRow}>
            <FontAwesome name="calendar" size={14} color="#666" />
            <Text style={styles.detailText}> {booking.date}</Text>
          </View>
          <View style={styles.detailsRow}>
            <FontAwesome name="clock-o" size={14} color="#666" />
            <Text style={styles.detailText}> {booking.time}</Text>
          </View>
          <View style={styles.detailsRow}>
            <FontAwesome name="user" size={14} color="#666" />
            <Text style={styles.detailText}> {booking.guests}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBottom}>
        {variant === 'upcoming' ? (
          <>
            <TouchableOpacity style={styles.modifyBtn} onPress={onEdit}>
              <Text style={styles.modifyText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <FontAwesome name="times" size={14} color="#fff" />
              <Text style={styles.cancelText}> Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.modifyBtn} onPress={onBookAgain}>
              <Text style={styles.modifyText}>Book Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onDelete}>
              <FontAwesome name="times" size={14} color="#fff" />
              <Text style={styles.cancelText}> Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.bookingID}>Booking ID: {booking.bookingID}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 70,
    height: 70,
    backgroundColor: '#ff8787',
    borderRadius: 10,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  resName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    marginBottom: 2,
  },
  resType: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Arial',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Arial',
  },
  cardBottom: {
    flexDirection: 'row',
    gap: 10,
  },
  modifyBtn: {
    flex: 1,
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modifyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Arial',
  },
  cancelBtn: {
    backgroundColor: '#ffb3ba',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Arial',
  },
  bookingID: {
    fontSize: 11,
    color: '#ccc',
    fontFamily: 'Arial',
    marginTop: 10,
  },
});
