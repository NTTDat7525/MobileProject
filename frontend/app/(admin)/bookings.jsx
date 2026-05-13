import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAllBookings,
  updateBookingStatus,
  adminCancelBooking,
} from '@/src/services/booking.service';
import Badge from '@/src/components/common/Badge';
import Button from '@/src/components/common/Button';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';

const BOOKING_STATUSES = ['đang chờ', 'đã xác nhận', 'đã check-in', 'hoàn thành', 'đã hủy'];
const FILTER_OPTIONS = ['Tất cả', ...BOOKING_STATUSES];

export default function AdminBookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllBookings();
      const data = res.data?.bookings ?? res.data ?? [];
      setBookings([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Endpoint GET /admin/bookings chưa được triển khai trên backend.');
      } else {
        setError('Không thể tải danh sách đặt bàn.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setActionModalVisible(false);
      loadBookings();
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    Alert.alert('Huỷ đặt bàn', 'Bạn có chắc muốn huỷ đặt bàn này?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Huỷ đặt bàn',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          try {
            await adminCancelBooking(bookingId);
            setActionModalVisible(false);
            loadBookings();
          } catch {
            Alert.alert('Lỗi', 'Không thể huỷ đặt bàn.');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const openActions = (booking) => {
    setSelectedBooking(booking);
    setActionModalVisible(true);
  };

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

  const formatPrice = (price) => Number(price).toLocaleString('vi-VN') + ' ₫';

  const filteredBookings =
    selectedStatus === 'Tất cả'
      ? bookings
      : bookings.filter((b) => b.status === selectedStatus);

  const renderBooking = ({ item }) => (
    <TouchableOpacity style={styles.bookingRow} onPress={() => openActions(item)} activeOpacity={0.8}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingMeta}>
          <Text style={styles.tableName}>{item.Table?.tableName ?? 'Bàn'}</Text>
          <Text style={styles.userName}>
            Khách hàng: {item.User?.username ?? item.guestEmail ?? '–'}
          </Text>
        </View>
        <Badge label={item.status} />
      </View>

      <View style={styles.bookingDetails}>
        <Text style={styles.detailText}>Thời gian: {formatDate(item.time)}{'\n'}
                                        Số lượng khách: {item.numberOfGuests}
        </Text>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.priceText}>Tổng tiền: {formatPrice(item.totalPrice)}</Text>
        <Badge label={item.paymentStatus} />
      </View>

      <Text style={styles.tapHint}>Nhấn để xử lý →</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Quản lý đặt bàn</Text>
        <TouchableOpacity onPress={loadBookings}>
          <Ionicons name="refresh" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={FILTER_OPTIONS}
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
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadBookings}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Không có đặt bàn nào</Text>
            </View>
          }
        />
      )}
      
      <Modal
        visible={actionModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xử lý đặt bàn</Text>

            {selectedBooking && (
              <View style={styles.modalInfo}>
                <View style={styles.modalRow}>
                  <Ionicons name="restaurant-outline" size={18} color={Colors.primary} />
                  <Text style={styles.modalTableName}>
                    {selectedBooking.Table?.tableName ?? 'Bàn'}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Ionicons name="person-outline" size={18} color={Colors.primary} />
                  <Text style={styles.modalDetail}>
                    {selectedBooking.User?.username ?? selectedBooking.guestEmail}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
                  <Text style={styles.modalDetail}>
                    {formatDate(selectedBooking.time)}
                  </Text>
                </View>
                <View style={styles.modalStatusRow}>
                  <Text style={styles.modalDetail}>Trạng thái hiện tại:</Text>
                  <Badge label={selectedBooking.status} style={styles.modalBadge} />
                </View>
              </View>
            )}

            <Text style={styles.actionTitle}>Cập nhật trạng thái</Text>
            <View style={styles.statusOptions}>
              {BOOKING_STATUSES.filter((s) => s !== 'đã hủy').map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    selectedBooking?.status === status && styles.statusOptionCurrent,
                  ]}
                  onPress={() => handleUpdateStatus(selectedBooking?.id, status)}
                  disabled={actionLoading || selectedBooking?.status === status}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      selectedBooking?.status === status && styles.statusOptionTextCurrent,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              {selectedBooking?.status !== 'đã hủy' && selectedBooking?.status !== 'hoàn thành' && (
                <Button
                  title="Huỷ đặt bàn"
                  variant="danger"
                  onPress={() => handleCancel(selectedBooking?.id)}
                  loading={actionLoading}
                  style={styles.cancelBookingBtn}
                />
              )}
              <Button
                title="Đóng"
                variant="outline"
                onPress={() => setActionModalVisible(false)}
                style={styles.closeBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  pageTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text
  },

  refreshIcon: {
    fontSize: 22
  },

  filterList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    paddingVertical: Spacing.sm
  },

  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },

  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },

  chipText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary
  },
  chipTextActive: {
    color: Colors.primaryDark,
    fontWeight: FontWeight.semibold
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
    height: 650,
  },
  
  bookingRow: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm
  },

  bookingMeta: {
    flex: 1,
  },

  tableName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  userName: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  bookingDetails: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  detailText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  bookingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  priceText: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.primary },
  tapHint: { fontSize: FontSize.xs, color: Colors.textLight, textAlign: 'right', marginTop: 4 },
  separator: { height: Spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  loadingText: { marginTop: Spacing.sm, color: Colors.textSecondary },
  errorIcon: { fontSize: 48, marginBottom: Spacing.sm },
  errorText: { fontSize: FontSize.sm, color: Colors.error, textAlign: 'center' },
  retryText: { fontSize: FontSize.base, color: Colors.primary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.base, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 6,
},
  modalInfo: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  modalTableName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text, marginBottom: Spacing.xs },
  modalDetail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  modalStatusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  modalBadge: {},
  actionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  statusOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md },
  statusOption: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  statusOptionCurrent: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  statusOptionText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  statusOptionTextCurrent: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
  modalActions: { flexDirection: 'row', gap: Spacing.sm },
  cancelBookingBtn: { flex: 1 },
  closeBtn: { flex: 1 },
});
