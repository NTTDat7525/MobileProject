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

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: 'pending',
    paymentMethod: 'cash',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      // Get all orders - you may need to create an admin endpoint to list all orders
      const response = await axios.get(`${API_BASE}/admin/orders/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // For demo, using stats data
      setOrders([]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(
        `${API_BASE}/admin/orders/${selectedOrder._id}/status`,
        { status: updateData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Order status updated');
      setModalVisible(false);
      fetchOrders();
    } catch (error) {
      Alert.alert('Error', 'Failed to update order');
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.put(
        `${API_BASE}/admin/orders/${orderId}/pay`,
        { paymentMethod: 'cash', transactionId: `TXN${Date.now()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Payment marked as paid');
      fetchOrders();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message);
    }
  };

  const statusOptions = [
    'pending',
    'preparing',
    'ready',
    'served',
    'completed',
    'cancelled',
  ];

  const renderOrder = ({ item }) => (
    <ListItem
      title={`Order #${item.orderNumber}`}
      subtitle={`Total: ₫${item.totalAmount} • Items: ${item.items?.length || 0}`}
      status={item.status}
      onPress={() => {
        setSelectedOrder(item);
        setUpdateData({ status: item.status, paymentMethod: item.paymentMethod });
        setModalVisible(true);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <AdminHeader title="Orders" onFilter={() => {}} />

      {loading ? (
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders to display</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Update Status Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Order</Text>

            <ScrollView style={styles.formContainer}>
              <Text style={styles.label}>Order #: {selectedOrder?.orderNumber}</Text>
              <Text style={styles.label}>
                Total: ₫{selectedOrder?.totalAmount}
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
                label="Payment Method"
                value={updateData.paymentMethod}
                onChangeText={(text) =>
                  setUpdateData({ ...updateData, paymentMethod: text })
                }
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  formContainer: {
    maxHeight: 400,
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
    fontSize: 12,
  },
  statusTextActive: {
    color: '#fff',
    fontSize: 12,
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
