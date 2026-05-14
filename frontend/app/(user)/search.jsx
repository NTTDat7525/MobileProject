import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTables } from '@/src/services/table.service';
import Badge from '@/src/components/common/Badge';
import Card from '@/src/components/common/Card';
import LoadingState from '@/src/components/common/LoadingState';
import EmptyState from '@/src/components/common/EmptyState';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';

const LOCATIONS = ['Tất cả', 'Trong nhà', 'Ngoài trời', 'Sân thượng'];

export default function SearchScreen() {
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả');
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadTables();
    }, [])
  );

  const loadTables = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTables();
      const data = res.data?.tables ?? res.data ?? [];
      setTables(data);
    } catch {
      setError('Không thể tải danh sách bàn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTables = selectedLocation === 'Tất cả'
    ? tables
    : tables.filter((t) => t.location === selectedLocation);

  const handleSelectTable = (table) => {
    router.push({
      pathname: '/(user)/booking',
      params: {
        tableId: table.id,
        tableName: table.tableName,
        price: table.price,
        capacity: table.capacity,
        location: table.location,
      },
    });
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const renderTable = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => item.status === 'Có sẵn' && handleSelectTable(item)}
    >
      <Card style={[styles.tableCard, item.status !== 'Có sẵn' && styles.unavailable]}>
        {item.image ? (
          <Image source={{ uri: `http://192.168.1.8:5001${item.image}` }} style={styles.tableImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}></Text>
          </View>
        )}
        <View style={styles.tableInfo}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableName}>{item.tableName}</Text>
            <Badge label={item.status} />
          </View>
          <View style={styles.tableDetails}>
            <Text style={styles.detail}>Vị trí: {item.location}</Text>
            <Text style={styles.detail}>Tối đa: {item.capacity} khách</Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>
          {item.status === 'Có sẵn' && (
            <Text style={styles.selectHint}>Nhấn để đặt bàn →</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Tìm bàn</Text>
        <Text style={styles.pageSubtitle}>Chọn bàn phù hợp với bạn</Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={LOCATIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedLocation === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedLocation(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedLocation === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <LoadingState message="Đang tìm bàn phù hợp..." />
      ) : error ? (
        <EmptyState tone="error" title="Không tải được danh sách bàn" message={error} actionLabel="Thử lại" onAction={loadTables} />
      ) : (
        <FlatList
          data={filteredTables}
          keyExtractor={(item) => item.id}
          renderItem={renderTable}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState title="Không có bàn phù hợp" message="Hãy thử chọn khu vực khác hoặc quay lại sau." />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.text },
  pageSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  filterContainer: { paddingVertical: Spacing.sm },
  filterList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  filterChipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  tableCard: { marginBottom: 0, padding: 0, overflow: 'hidden' },
  unavailable: { opacity: 0.6 },
  tableImage: { width: '100%', height: 156, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  imagePlaceholder: {
    width: '100%',
    height: 126,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: { fontSize: 40 },
  tableInfo: { padding: Spacing.md },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tableName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, flex: 1, marginRight: Spacing.sm },
  tableDetails: { gap: 4 },
  detail: { fontSize: FontSize.sm, color: Colors.textSecondary },
  price: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.heavy,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  selectHint: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontWeight: FontWeight.medium,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
});
