import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getBookingById } from '@/src/services/booking.service';
import Badge from '@/src/components/common/Badge';
import Card from '@/src/components/common/Card';
import Button from '@/src/components/common/Button';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await getBookingById(bookingId);
      setBooking(res.data?.booking ?? res.data);
    } catch {
      setError('Không thể tải thông tin đặt bàn.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '–';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error || 'Không tìm thấy đặt bàn'}</Text>
        <TouchableOpacity onPress={() => router.replace('/(user)/history')}>
          <Text style={styles.link}>Xem lịch sử đặt bàn</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.successBanner}>
          <Text style={styles.successTitle}>Xác nhận thông tin!</Text>
          <Text style={styles.successSub}>Mã đặt bàn: #{bookingId?.slice(0, 8)}</Text>
        </View>

        <Card style={styles.detailCard}>
          <Text style={styles.cardTitle}>Chi tiết đặt bàn</Text>

          <DetailRow icon="restaurant-outline" label="Bàn" value={booking.Table?.tableName ?? 'N/A'} />
          <DetailRow icon="location-outline" label="Vị trí" value={booking.Table?.location ?? 'N/A'} />
          <DetailRow icon="calendar-outline" label="Thời gian" value={formatDate(booking.time)} />
          <DetailRow icon="people-outline" label="Số khách" value={`${booking.numberOfGuests} khách`} />
          <DetailRow icon="mail-outline" label="Email" value={booking.guestEmail} />
          <DetailRow icon="call-outline" label="Điện thoại" value={booking.guestPhone} />

          {booking.specialRequests ? (
            <DetailRow icon="document-text-outline" label="Yêu cầu" value={booking.specialRequests} />
          ) : null}

          <View style={styles.divider} />

          <DetailRow
            icon="card-outline"
            label="Thanh toán"
            value={booking.PaymentMethod}
          />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tổng tiền</Text>
            <Text style={styles.priceValue}>{formatPrice(booking.totalPrice)}</Text>
          </View>
        </Card>

        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Trạng thái đặt bàn</Text>
            <Badge label={booking.status} />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Trạng thái thanh toán</Text>
            <Badge label={booking.paymentStatus} />
          </View>
        </Card>

        <View style={styles.actions}>
          {booking.PaymentMethod === 'chuyển khoản ngân hàng' &&
            booking.paymentStatus === 'chưa thanh toán' && (
              <Button
                title="Thanh toán ngay"
                onPress={() =>
                  router.push({
                    pathname: '/(user)/payment',
                    params: { bookingId },
                  })
                }
                style={styles.actionBtn}
                size="lg"
              />
            )}
          <Button
            title="Về trang chủ"
            onPress={() => router.replace('/(user)/home')}
            variant="outline"
            style={styles.actionBtn}
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={Colors.primary} style={{ width: 28 }} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  loadingText: { marginTop: Spacing.sm, color: Colors.textSecondary },
  errorText: { fontSize: FontSize.base, color: Colors.error, textAlign: 'center' },
  link: { fontSize: FontSize.base, color: Colors.primary, marginTop: Spacing.md },
  successBanner: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.successLight,
    borderRadius: 16,
    marginBottom: Spacing.lg,
  },
  successTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.success },
  successSub: { fontSize: FontSize.sm, color: Colors.success, marginTop: 4 },
  detailCard: { marginBottom: Spacing.md },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  detailValue: {
    flex: 2,
    fontSize: FontSize.sm,
    color: Colors.text,
    textAlign: 'right',
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  priceLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  priceValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  statusCard: { marginBottom: Spacing.lg },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  statusLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  actions: { gap: Spacing.sm },
  actionBtn: {},
});
