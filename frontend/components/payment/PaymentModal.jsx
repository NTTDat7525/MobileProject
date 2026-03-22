import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

/**
 * PaymentModal Component
 * Display payment options and process payment
 */
export default function PaymentModal({
  visible,
  onClose,
  totalAmount,
  depositAmount,
  bookingId,
  onConfirm,
  loading = false,
}) {
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    onConfirm?.({
      method: paymentMethod,
      amount: depositAmount,
      bookingId,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Payment</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Amount Section */}
          <Card style={styles.amountCard}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.amountRow}>
              <View>
                <Text style={styles.depositLabel}>Deposit (20%):</Text>
                <Text style={styles.depositNote}>Required to confirm booking</Text>
              </View>
              <Text style={styles.depositAmount}>{formatCurrency(depositAmount)}</Text>
            </View>
          </Card>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/* VNPay */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'vnpay' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('vnpay')}
          >
            <View style={styles.paymentOptionContent}>
              <MaterialCommunityIcons
                name="credit-card"
                size={28}
                color="#1f2937"
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>VNPay</Text>
                <Text style={styles.paymentDesc}>Debit/Credit Card, E-Wallet</Text>
              </View>
            </View>
            {paymentMethod === 'vnpay' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#ff9e6b"
              />
            )}
          </TouchableOpacity>

          {/* Bank Transfer */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'bank' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('bank')}
          >
            <View style={styles.paymentOptionContent}>
              <MaterialCommunityIcons
                name="bank"
                size={28}
                color="#1f2937"
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Bank Transfer</Text>
                <Text style={styles.paymentDesc}>Direct bank transfer</Text>
              </View>
            </View>
            {paymentMethod === 'bank' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#ff9e6b"
              />
            )}
          </TouchableOpacity>

          {/* Cash Payment */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentOptionContent}>
              <MaterialCommunityIcons
                name="cash"
                size={28}
                color="#1f2937"
              />
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Pay at Restaurant</Text>
                <Text style={styles.paymentDesc}>Pay when you arrive</Text>
              </View>
            </View>
            {paymentMethod === 'cash' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#ff9e6b"
              />
            )}
          </TouchableOpacity>

          {/* Info Note */}
          {paymentMethod === 'vnpay' && (
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={16} color="#3b82f6" />
              <Text style={styles.infoText}>
                You will be redirected to VNPay to complete the payment
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              onPress={onClose}
              style={styles.cancelButton}
              textStyle={styles.cancelText}
              disabled={loading}
            />
            <Button
              title={loading ? 'Processing...' : `Pay ${formatCurrency(depositAmount)}`}
              onPress={handlePayment}
              disabled={loading}
              style={styles.payButton}
            />
          </View>

          {loading && <ActivityIndicator size="large" color="#ff9e6b" />}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  amountCard: {
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  depositLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  depositNote: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9e6b',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentOptionSelected: {
    backgroundColor: '#fff9f4',
    borderColor: '#ff9e6b',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 16,
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#0c4a6e',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  cancelText: {
    color: '#6b7280',
  },
  payButton: {
    flex: 1,
  },
});
