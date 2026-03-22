import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserHeader from '@/components/user/UserHeader';
import TableCard from '@/components/user/TableCard';
import Button from '@/components/ui/Button';
import FormInput from '@/components/admin/FormInput';
import { router } from 'expo-router';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function UserTables() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterType) params.type = filterType;
      if (filterCapacity) params.capacity = parseInt(filterCapacity);

      const response = await axios.get(`${API_BASE}/users/tables`, {
        params,
      });

      setTables(response.data.tables || []);
      setFilteredTables(response.data.tables || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
      Alert.alert('Error', 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchTables();
  };

  const handleSelectTable = (tableId) => {
    router.push({
      pathname: '/user/bookings-create',
      params: { tableId },
    });
  };

  const tableTypes = ['standard', 'vip', 'bar', 'outdoor'];

  return (
    <View style={styles.container}>
      <UserHeader title="Available Tables" showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={styles.filterCol}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.typeButtons}>
                {['All', ...tableTypes].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeBtn,
                      (type === 'All' ? filterType === '' : filterType === type) &&
                        styles.typeBtnActive,
                    ]}
                    onPress={() => {
                      setFilterType(type === 'All' ? '' : type);
                    }}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        (type === 'All' ? filterType === '' : filterType === type) &&
                          styles.typeTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <FormInput
            label="Minimum Guests"
            placeholder="e.g., 2, 4, 6"
            value={filterCapacity}
            onChangeText={setFilterCapacity}
            keyboardType="numeric"
          />

          <Button title="Search" onPress={handleFilter} style={styles.searchBtn} />
        </View>

        {/* Tables List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ff9e6b"
            style={styles.loader}
          />
        ) : filteredTables.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tables available</Text>
            <Text style={styles.emptySubtext}>Try different filters</Text>
          </View>
        ) : (
          <View style={styles.listContent}>
            {filteredTables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                onPress={() => console.log('View table', table._id)}
                onSelect={handleSelectTable}
              />
            ))}
          </View>
        )}
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
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterRow: {
    marginBottom: 16,
  },
  filterCol: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  typeBtnActive: {
    backgroundColor: '#ff9e6b',
    borderColor: '#ff9e6b',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeTextActive: {
    color: '#fff',
  },
  searchBtn: {
    marginTop: 12,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#d1d5db',
  },
});
