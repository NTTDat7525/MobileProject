import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminHeader from '@/components/admin/AdminHeader';
import ListItem from '@/components/admin/ListItem';
import FormInput from '@/components/admin/FormInput';
import Button from '@/components/ui/Button';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    fatchBookings();
  }, []);

  const fatchBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      // Need to create endpoint to get all bookings - using sample data for now
      const response = await axios.get(`${API_BASE}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(error);
      // Silently fail - endpoint may not exist yet
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(
        `${API_BASE}/admin/bookings/${selectedBooking._id}/status`,
        { status: updateData.status, notes: updateData.notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Booking updated');
      setModalVisible(false);
      fatchBookings();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message);
    }
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert('Cancel Booking', 'Reason for cancellation:', [
      {
        text: 'Admin Request',
        onPress: () => cancelBookingWithReason(bookingId, 'Admin cancelled'),
      },
      {
        text: 'Customer Request',
        onPress: () => cancelBookingWithReason(bookingId, 'Customer cancelled'),
      },
      { text: 'Cancel' },
    ]);
  };

  const cancelBookingWithReason = async (bookingId, reason) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(
        `${API_BASE}/admin/bookings/${bookingId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Booking cancelled');
      fatchBookings();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message);
    }
  };

  const statusOptions = ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'];

  const renderBooking = ({ item }) => (
    <ListItem
      title={`Booking #${item._id?.slice(-5) || '...'}`}
      subtitle={`${item.numberOfGuests} guests • ${new Date(item.bookingDate).toLocaleDateString()}`}
      status={item.status}
      onPress={() => {
        setSelectedBooking(item);
        setUpdateData({ status: item.status, notes: item.internalNotes || '' });
        setModalVisible(true);
      }}
      onDelete={() => handleCancelBooking(item._id)}
    />
  );

  return (
    <View style={styles.container}>
      <AdminHeader title="Bookings" onFilter={() => {}} />

      {loading ? (
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>No bookings found</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Update Booking Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Booking</Text>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.info}>
                Guest: {selectedBooking?.guestName}
              </Text>
              <Text style={styles.info}>
                Date: {new Date(selectedBooking?.bookingDate).toLocaleDateString()}
              </Text>
              <Text style={styles.info}>
                Guests: {selectedBooking?.numberOfGuests}
              </Text>

              <Text style={styles.label}>Status</Text>
              <View style={styles.statusGrid}>
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    title={status}
                    onPress={() =>
                      setUpdateData({ ...updateData, status })
                    }
                    style={[
                      styles.statusBtn,
                      updateData.status === status &&
                      styles.statusBtnActive,
                    ]}
                    textStyle={
                      updateData.status === status
                        ? styles.statusTextActive
                        : styles.statusText
                    }
                  />
                ))}
              </View>

              <FormInput
                label="Internal Notes"
                placeholder="Add notes"
                value={updateData.notes}
                onChangeText={(text) =>
                  setUpdateData({ ...updateData, notes: text })
                }
                multiline
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
                textStyle={styles.cancelText}
              />
              <Button
                title="Update"
                onPress={handleUpdateStatus}
                style={styles.submitBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  info: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 12,
  },
  formContainer: {
    maxHeight: 350,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusBtn: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
  },
  statusBtnActive: {
    backgroundColor: '#ff9e6b',
  },
  statusText: {
    color: '#6b7280',
    fontSize: 11,
  },
  statusTextActive: {
    color: '#fff',
    fontSize: 11,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  cancelText: {
    color: '#6b7280',
  },
  submitBtn: {
    flex: 1,
  },
});
