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

export default function FoodsScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    cuisine: 'vietnamese',
    price: '',
    spiceLevel: '0',
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/admin/foods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFoods(response.data.foods || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.post(`${API_BASE}/admin/foods`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Food item added');
      setModalVisible(false);
      resetForm();
      fetchFoods();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add food');
    }
  };

  const handleDeleteFood = (foodId) => {
    Alert.alert('Delete Food', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            await axios.delete(`${API_BASE}/admin/foods/${foodId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Success', 'Food deleted');
            fetchFoods();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete food');
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      cuisine: 'vietnamese',
      price: '',
      spiceLevel: '0',
    });
    setIsEditing(false);
  };

  const renderFood = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={`₫${item.price} • ${item.category}`}
      onDelete={() => handleDeleteFood(item._id)}
    />
  );

  return (
    <View style={styles.container}>
      <AdminHeader
        title="Foods"
        onAdd={() => {
          resetForm();
          setModalVisible(true);
        }}
        onFilter={() => {}}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      ) : (
        <FlatList
          data={foods}
          renderItem={renderFood}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No foods found</Text>
          }
        />
      )}

      {/* Add Food Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Food Item</Text>

            <ScrollView style={styles.formContainer}>
              <FormInput
                label="Food Name *"
                placeholder="e.g., Pad Thai"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />

              <FormInput
                label="Description"
                placeholder="Describe the dish"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                multiline
              />

              <FormInput
                label="Category *"
                placeholder="e.g., appetizer, main, dessert"
                value={formData.category}
                onChangeText={(text) =>
                  setFormData({ ...formData, category: text })
                }
              />

              <FormInput
                label="Cuisine"
                placeholder="e.g., vietnamese, asian"
                value={formData.cuisine}
                onChangeText={(text) =>
                  setFormData({ ...formData, cuisine: text })
                }
              />

              <FormInput
                label="Price *"
                placeholder="₫"
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                keyboardType="decimal-pad"
              />

              <FormInput
                label="Spice Level (0-5)"
                placeholder="0"
                value={formData.spiceLevel}
                onChangeText={(text) =>
                  setFormData({ ...formData, spiceLevel: text })
                }
                keyboardType="numeric"
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
                title="Add"
                onPress={handleAddFood}
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
  formContainer: {
    maxHeight: 350,
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
