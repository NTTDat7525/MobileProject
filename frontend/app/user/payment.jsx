import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import PaymentModal from '@/components/payment/PaymentModal';
import Button from '@/components/ui/Button';
import Card from '@/components/common/Card';
import SectionHeader from '@/components/common/SectionHeader';

const API_BASE = 'http://192.168.1.9:5001/api';

/**
 * PaymentScreen Component
 * Handle payment processing for bookings
 */
export default function PaymentScreen({ 
  bookingId,
  tableId,
  totalAmount,
  onPaymentSuccess,
  onPaymentFailed
}) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const depositAmount = Math.ceil(totalAmount * 0.2); // 20% deposit

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${API_BASE}/users/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async (paymentData) => {
    try {
      setProcessing(true);
      const token = await AsyncStorage.getItem('accessToken');

      // For VNPay, call backend to get payment URL
      if (paymentData.method === 'vnpay') {
        const response = await axios.post(
          `${API_BASE}/payment/create-vnpay`,
          {
            bookingId,
            amount: depositAmount,
            orderInfo: `Booking deposit for table ${tableId}`,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.paymentUrl) {
          // Navigate to payment URL (in real app, open WebView or external browser)
          Alert.alert(
            'Payment',
            'Redirecting to VNPay...',
            [{ text: 'OK', onPress: () => {
              // In production, use WebView to open payment URL
              // For now, simulate successful payment
              handlePaymentSuccess(bookingId);
            }}]
          );
        }
      } else if (paymentData.method === 'cash') {
        // Pending payment for cash payment at restaurant
        await axios.put(
          `${API_BASE}/users/bookings/${bookingId}`,
          { paymentStatus: 'pending' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handlePaymentSuccess(bookingId);
      } else if (paymentData.method === 'bank') {
        // Pending payment for bank transfer
        await axios.put(
          `${API_BASE}/users/bookings/${bookingId}`,
          { paymentStatus: 'pending', paymentMethod: 'bank_transfer' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handlePaymentSuccess(bookingId);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment processing failed. Please try again.');
      onPaymentFailed?.();
    } finally {
      setProcessing(false);
      setPaymentModalVisible(false);
    }
  };

  const handlePaymentSuccess = async (id) => {
    Alert.alert(
      'Success',
      'Booking confirmed! Payment may take a few moments to process.',
      [
        {
          text: 'View Booking',
          onPress: () => {
            onPaymentSuccess?.();
            router.push(`/bookings/${id}`);
          },
        },
        {
          text: 'Done',
          onPress: () => {
            onPaymentSuccess?.();
            router.push('/(tabs)/bookings');
          },
        },
      ]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff9e6b" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service Charge</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.borderTop]}>
          <View>
            <Text style={styles.summaryLabel}>Deposit Required (20%)</Text>
            <Text style={styles.summaryDesc}>Secures your booking</Text>
          </View>
          <Text style={styles.depositValue}>{formatCurrency(depositAmount)}</Text>
        </View>
      </Card>

      {/* Payment Terms */}
      <View style={styles.section}>
        <SectionHeader title="Payment Terms" />
        <Card>
          <View style={styles.termItem}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color="#10b981"
            />
            <Text style={styles.termText}>Deposit will be held until your booking</Text>
          </View>
          <View style={[styles.termItem, styles.borderTop]}>
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={20}
              color="#3b82f6"
            />
            <Text style={styles.termText}>Safe and secure payment processing</Text>
          </View>
          <View style={[styles.termItem, styles.borderTop]}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={20}
              color="#f59e0b"
            />
            <Text style={styles.termText}>24/7 customer support</Text>
          </View>
        </Card>
      </View>

      {/* Payment Button */}
      <View style={styles.footer}>
        <Button
          title={`Pay Deposit ${formatCurrency(depositAmount)}`}
          onPress={() => setPaymentModalVisible(true)}
          disabled={processing}
          style={styles.payButton}
        />
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Continue without payment</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        totalAmount={totalAmount}
        depositAmount={depositAmount}
        bookingId={bookingId}
        onConfirm={handlePaymentConfirm}
        loading={processing}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryDesc: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  depositValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9e6b',
  },
  section: {
    marginBottom: 20,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  termText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  footer: {
    gap: 10,
    marginBottom: 40,
  },
  payButton: {
    minHeight: 50,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: '#ff9e6b',
    fontWeight: '600',
  },
});
