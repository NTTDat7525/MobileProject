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

export default function TablesScreen() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    type: 'standard',
    location: 'indoor',
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/admin/tables/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(response.data.tables || []);
      setFilteredTables(response.data.tables || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async () => {
    if (!formData.tableNumber || !formData.capacity) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(`${API_BASE}/admin/tables`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Table added successfully');
      setModalVisible(false);
      setFormData({
        tableNumber: '',
        capacity: '',
        type: 'standard',
        location: 'indoor',
      });
      fetchTables();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add table');
    }
  };

  const handleDeleteTable = (tableId) => {
    Alert.alert('Delete Table', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            await axios.delete(`${API_BASE}/admin/tables/${tableId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Success', 'Table deleted');
            fetchTables();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete table');
          }
        },
      },
    ]);
  };

  const renderTable = ({ item }) => (
    <ListItem
      title={`Table ${item.tableNumber}`}
      subtitle={`Capacity: ${item.capacity} - ${item.type} - ${item.location}`}
      status={item.status}
      onDelete={() => handleDeleteTable(item._id)}
    />
  );

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Tables"
        onAdd={() => setModalVisible(true)}
        onFilter={() => {}}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredTables}
          renderItem={renderTable}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tables found</Text>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Table</Text>

            <ScrollView style={styles.formContainer}>
              <FormInput
                label="Table Number"
                placeholder="e.g., 1, 2, 3"
                value={formData.tableNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, tableNumber: text })
                }
                keyboardType="numeric"
              />

              <FormInput
                label="Capacity"
                placeholder="Number of guests"
                value={formData.capacity}
                onChangeText={(text) =>
                  setFormData({ ...formData, capacity: text })
                }
                keyboardType="numeric"
              />

              <FormInput
                label="Type"
                placeholder="e.g., standard, vip, bar"
                value={formData.type}
                onChangeText={(text) =>
                  setFormData({ ...formData, type: text })
                }
              />

              <FormInput
                label="Location"
                placeholder="e.g., indoor, outdoor, terrace"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
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
                title="Add Table"
                onPress={handleAddTable}
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
  formContainer: {
    maxHeight: 300,
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
