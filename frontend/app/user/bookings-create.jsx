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
import { router, useLocalSearchParams } from 'expo-router';
import UserHeader from '@/components/user/UserHeader';
import FormInput from '@/components/admin/FormInput';
import Button from '@/components/ui/Button';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function BookingCreate() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [tableId, setTableId] = useState(params.tableId || '');
  const [formData, setFormData] = useState({
    bookingDate: '',
    numberOfGuests: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
    occasion: 'regular',
  });

  useEffect(() => {
    // Fetch user data to prefill some fields
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data.user;

      setFormData((prev) => ({
        ...prev,
        guestName: user.displayName || '',
        guestEmail: user.email || '',
        guestPhone: user.phone || '',
      }));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!tableId || !formData.bookingDate || !formData.numberOfGuests) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (parseInt(formData.numberOfGuests) < 1 || parseInt(formData.numberOfGuests) > 30) {
      Alert.alert('Error', 'Number of guests must be between 1 and 30');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');

      const bookingData = {
        tableId,
        bookingDate: formData.bookingDate,
        numberOfGuests: parseInt(formData.numberOfGuests),
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        specialRequests: formData.specialRequests,
        occasion: formData.occasion,
      };

      const response = await axios.post(`${API_BASE}/users/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Booking created successfully', [
        {
          text: 'View',
          onPress: () =>
            router.push(`/user/bookings/${response.data.booking._id}`),
        },
        {
          text: 'Done',
          onPress: () => router.push('/user/bookings'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const occasions = ['regular', 'birthday', 'anniversary', 'business', 'family'];

  return (
    <View style={styles.container}>
      <UserHeader title="Create Booking" showBack />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Booking Details</Text>

        <FormInput
          label="Booking Date *"
          placeholder="YYYY-MM-DD"
          value={formData.bookingDate}
          onChangeText={(text) => setFormData({ ...formData, bookingDate: text })}
        />

        <FormInput
          label="Number of Guests *"
          placeholder="1-30"
          value={formData.numberOfGuests}
          onChangeText={(text) => setFormData({ ...formData, numberOfGuests: text })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Occasion</Text>
        <View style={styles.occasionGrid}>
          {occasions.map((occasion) => (
            <Button
              key={occasion}
              title={occasion}
              onPress={() => setFormData({ ...formData, occasion })}
              style={[
                styles.occasionBtn,
                formData.occasion === occasion && styles.occasionBtnActive,
              ]}
              textStyle={
                formData.occasion === occasion
                  ? styles.occasionTextActive
                  : styles.occasionText
              }
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Guest Information</Text>

        <FormInput
          label="Guest Name"
          placeholder="Full name"
          value={formData.guestName}
          onChangeText={(text) => setFormData({ ...formData, guestName: text })}
        />

        <FormInput
          label="Email"
          placeholder="guest@example.com"
          value={formData.guestEmail}
          onChangeText={(text) => setFormData({ ...formData, guestEmail: text })}
          keyboardType="email-address"
        />

        <FormInput
          label="Phone"
          placeholder="+84..."
          value={formData.guestPhone}
          onChangeText={(text) => setFormData({ ...formData, guestPhone: text })}
          keyboardType="phone-pad"
        />

        <Text style={styles.sectionTitle}>Additional Information</Text>

        <FormInput
          label="Special Requests"
          placeholder="Any special requirements?"
          value={formData.specialRequests}
          onChangeText={(text) => setFormData({ ...formData, specialRequests: text })}
          multiline
        />

        <View style={styles.buttons}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            style={styles.cancelBtn}
            textStyle={styles.cancelText}
          />
          <Button
            title="Create Booking"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  occasionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  occasionBtn: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
  },
  occasionBtnActive: {
    backgroundColor: '#ff9e6b',
  },
  occasionText: {
    color: '#6b7280',
    fontSize: 12,
  },
  occasionTextActive: {
    color: '#fff',
    fontSize: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
    marginBottom: 40,
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
