import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FilterBar from '@/components/common/FilterBar';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TableCard from '@/components/user/TableCard';
import SectionHeader from '@/components/common/SectionHeader';
import Card from '@/components/common/Card';
import FormInput from '@/components/admin/FormInput';

const API_BASE = 'http://192.168.1.9:5001/api';

const TABLE_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'standard', label: 'Standard' },
  { id: 'vip', label: 'VIP' },
  { id: 'bar', label: 'Bar' },
  { id: 'outdoor', label: 'Outdoor' },
];

export default function BrowseScreen() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [minCapacity, setMinCapacity] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchTables();
    }, [activeType, minCapacity, searchDate])
  );

  const fetchTables = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      
      let params = {};
      if (activeType !== 'all') params.type = activeType;
      if (minCapacity) params.capacity = parseInt(minCapacity);
      if (searchDate) params.date = searchDate;

      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE}/users/tables${queryString ? '?' + queryString : ''}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTables(response.data.tables || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
      Alert.alert('Error', 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTable = (table) => {
    router.push({
      pathname: '/user/bookings-create',
      params: { tableId: table._id },
    });
  };

  const renderTableItem = ({ item }) => (
    <TableCard
      table={item}
      onSelect={() => handleSelectTable(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner fullScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Browse Tables</Text>
        <Text style={styles.subtitle}>Find and book your perfect table</Text>
      </View>

      <FlatList
        data={tables}
        renderItem={renderTableItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            {/* Filters */}
            <View style={styles.section}>
              <SectionHeader title="Table Type" />
              <FilterBar
                filters={TABLE_TYPES}
                activeFilter={activeType}
                onFilterChange={setActiveType}
                variant="chips"
              />
            </View>

            {/* Advanced Filters */}
            <View style={styles.section}>
              <SectionHeader title="Filters" />
              <Card style={styles.filterCard}>
                <FormInput
                  label="Minimum Capacity"
                  placeholder="Enter number of guests"
                  value={minCapacity}
                  onChangeText={setMinCapacity}
                  keyboardType="number-pad"
                />
                <FormInput
                  label="Preferred Date"
                  placeholder="YYYY-MM-DD"
                  value={searchDate}
                  onChangeText={setSearchDate}
                  style={{ marginTop: 12 }}
                />
              </Card>
            </View>

            {/* Results Count */}
            <View style={styles.resultsInfo}>
              <Text style={styles.resultsText}>
                Found {tables.length} available table{tables.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="table-furniture"
            title="No Tables Available"
            message={`No ${activeType !== 'all' ? activeType : ''} tables match your criteria`}
            color="#ff9e6b"
          />
        }
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterCard: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
