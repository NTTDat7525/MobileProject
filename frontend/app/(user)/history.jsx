import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getUserBookings, cancelBooking } from '@/src/services/booking.service';
import Badge from '@/src/components/common/Badge';
import Card from '@/src/components/common/Card';
import LoadingState from '@/src/components/common/LoadingState';
import EmptyState from '@/src/components/common/EmptyState';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';

const STATUS_FILTERS = ['Tất cả', 'đang chờ', 'đã xác nhận', 'đã check-in', 'hoàn thành', 'đã hủy'];

export default function HistoryScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getUserBookings();
      const data = res.data?.bookings ?? res.data ?? [];
      setBookings(data);
    } catch {
      setError('Không thể tải lịch sử đặt bàn.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (booking) => {
    Alert.alert(
      'Huỷ đặt bàn',
      `Bạn có chắc muốn huỷ đặt bàn ${booking.Table?.tableName ?? ''}?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Huỷ đặt bàn',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(booking.id);
              loadBookings();
            } catch {
              Alert.alert('Lỗi', 'Không thể huỷ đặt bàn. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const filteredBookings =
    selectedStatus === 'Tất cả'
      ? bookings
      : bookings.filter((b) => b.status === selectedStatus);

  const formatDate = (dateStr) => {
    if (!dateStr) return '–';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN') + ' ₫';

  const renderBooking = ({ item }) => {
    const canCancel = item.status === 'đang chờ' || item.status === 'đã xác nhận';
    const canPay =
      item.paymentStatus === 'chưa thanh toán' &&
      item.PaymentMethod === 'chuyển khoản ngân hàng' &&
      item.status !== 'đã hủy';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          router.push({ pathname: '/(user)/confirmation', params: { bookingId: item.id } })
        }
      >
        <Card style={styles.bookingCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.tableName}>{item.Table?.tableName ?? 'Bàn'}</Text>
            <Badge label={item.status} />
          </View>

          <Text style={styles.tableLocation}>
            Vị trí: {item.Table?.location ?? '–'}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoItem}>Thời gian: {formatDate(item.time)}</Text>
            <Text style={styles.infoItem}>Số khách: {item.numberOfGuests} khách</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tổng tiền:</Text>
            <Text style={styles.priceValue}>{formatPrice(item.totalPrice)}</Text>
            <Badge label={item.paymentStatus} style={styles.payBadge} />
          </View>

          {(canCancel || canPay) && (
            <View style={styles.actionRow}>
              {canPay && (
                <TouchableOpacity
                  style={styles.payBtn}
                  onPress={() =>
                    router.push({ pathname: '/(user)/payment', params: { bookingId: item.id } })
                  }
                >
                  <Text style={styles.payBtnText}>Thanh toán</Text>
                </TouchableOpacity>
              )}
              {canCancel && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleCancel(item)}
                >
                  <Text style={styles.cancelBtnText}>Huỷ</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Lịch sử đặt bàn</Text>
        <TouchableOpacity onPress={loadBookings}>
          <Ionicons name="refresh" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={STATUS_FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedStatus === item && styles.chipActive]}
            onPress={() => setSelectedStatus(item)}
          >
            <Text style={[styles.chipText, selectedStatus === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <LoadingState message="Đang tải lịch sử đặt bàn..." />
      ) : error ? (
        <EmptyState tone="error" title="Không tải được lịch sử" message={error} actionLabel="Thử lại" onAction={loadBookings} />
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon="calendar-outline" title="Chưa có đặt bàn" message="Các lượt đặt bàn của bạn sẽ xuất hiện tại đây." />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.text },
  filterList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingVertical: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  
  bookingCard: { marginBottom: 0 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  tableName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, flex: 1, marginRight: Spacing.sm },
  tableLocation: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  infoRow: { flexDirection: 'column', gap: Spacing.md, marginBottom: Spacing.sm },
  infoItem: { fontSize: FontSize.sm, color: Colors.textSecondary },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  priceLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  priceValue: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.primary },
  payBadge: {},
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  payBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  payBtnText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: FontWeight.semibold },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: FontSize.sm, color: Colors.error, fontWeight: FontWeight.semibold },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
});
