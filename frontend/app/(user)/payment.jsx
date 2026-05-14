import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getBookingById, getBookingPaymentInfo } from '@/src/services/booking.service';
import Badge from '@/src/components/common/Badge';
import Card from '@/src/components/common/Card';
import Button from '@/src/components/common/Button';
import LoadingState from '@/src/components/common/LoadingState';
import EmptyState from '@/src/components/common/EmptyState';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function PaymentScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) loadBooking();
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId || !booking || booking.paymentStatus === 'đã thanh toán') return;

    const intervalId = setInterval(async () => {
      try {
        const res = await getBookingById(bookingId);
        const nextBooking = res.data?.booking ?? res.data;
        setBooking(nextBooking);
        if (nextBooking?.paymentStatus === 'đã thanh toán') {
          router.replace({ pathname: '/(user)/confirmation', params: { bookingId } });
        }
      } catch {
        // Giữ nguyên màn hình nếu polling tạm thời lỗi mạng.
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [bookingId, booking?.paymentStatus]);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await getBookingById(bookingId);
      const nextBooking = res.data?.booking ?? res.data;
      setBooking(nextBooking);

      if (nextBooking?.PaymentMethod === 'chuyển khoản ngân hàng') {
        const paymentRes = await getBookingPaymentInfo(bookingId);
        setPayment(paymentRes.data?.payment ?? null);
      }
    } catch {
      setError('Không thể tải thông tin thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingState message="Đang tải thanh toán..." />
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState tone="error" title="Không có thông tin thanh toán" message={error || 'Không tìm thấy thông tin thanh toán.'} actionLabel="Quay lại" onAction={() => router.back()} />
      </SafeAreaView>
    );
  }

  const isPaid = booking.paymentStatus === 'đã thanh toán';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Colors.primary} />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Thanh toán</Text>

        <Card style={[styles.statusCard, isPaid && styles.statusCardPaid]}>
          <View style={styles.statusRow}>
            <Ionicons
              name={isPaid ? 'checkmark-circle' : 'time-outline'}
              size={32}
              color={isPaid ? Colors.success : Colors.warning}
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </Text>
              <Badge label={booking.paymentStatus} />
            </View>
          </View>
        </Card>

        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>Tổng số tiền cần thanh toán</Text>
          <Text style={styles.amountValue}>{formatPrice(booking.totalPrice)}</Text>
          <Text style={styles.amountNote}>
            Mã đặt bàn: #{bookingId?.slice(0, 8).toUpperCase()}
          </Text>
        </Card>
        {!isPaid && booking.PaymentMethod === 'chuyển khoản ngân hàng' && (
          <Card style={styles.bankCard}>
            <Text style={styles.bankTitle}>Thông tin chuyển khoản</Text>

            <View style={styles.qrPlaceholder}>
              {payment?.qrImageUrl ? (
                <Image source={{ uri: payment.qrImageUrl }} style={styles.qrImage} resizeMode="contain" />
              ) : (
                <Ionicons name="qr-code-outline" size={96} color={Colors.textLight} />
              )}
              <Text style={styles.qrText}>Quét mã để thanh toán</Text>
              <Text style={styles.qrAmount}>{formatPrice(booking.totalPrice)}</Text>
            </View>

            <View style={styles.bankDivider} />

            <BankRow label="Ngân hàng" value={payment?.bankCode || '-'} />
            <BankRow label="Số tài khoản" value={payment?.accountNo || '-'} copyable />
            <BankRow label="Chủ tài khoản" value={payment?.accountName || '-'} />
            <BankRow
              label="Nội dung CK"
              value={payment?.addInfo || '-'}
              copyable
            />
            <BankRow label="Số tiền" value={formatPrice(booking.totalPrice)} highlight />

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Vui lòng ghi đúng nội dung chuyển khoản để xác nhận tự động.
              </Text>
              <Text style={styles.noteText}>
                Trạng thái sẽ tự cập nhật sau khi SePay gửi webhook thành công.
              </Text>
            </View>
          </Card>
        )}

        {!isPaid && booking.PaymentMethod === 'tiền mặt' && (
          <Card style={styles.cashCard}>
            <Ionicons name="cash-outline" size={48} color={Colors.success} />
            <Text style={styles.cashTitle}>Thanh toán tại nhà hàng</Text>
            <Text style={styles.cashText}>
              Vui lòng thanh toán trực tiếp tại quầy khi đến nhà hàng.
              Mang theo mã đặt bàn: #{bookingId?.slice(0, 8).toUpperCase()}
            </Text>
          </Card>
        )}

        <Button
          title="Xem chi tiết đặt bàn"
          onPress={() =>
            router.push({ pathname: '/(user)/confirmation', params: { bookingId } })
          }
          variant="outline"
          style={styles.btn}
          size="lg"
        />
        <Button
          title="Về trang chủ"
          onPress={() => router.replace('/(user)/home')}
          variant="ghost"
          style={styles.btn}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function BankRow({ label, value, copyable, highlight }) {
  return (
    <View style={styles.bankRow}>
      <Text style={styles.bankLabel}>{label}</Text>
      <Text style={[styles.bankValue, highlight && styles.bankValueHighlight]}>
        {value}
      </Text>
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
  backBtn: { marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.medium },
  pageTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  statusCard: { marginBottom: Spacing.md, flexDirection: 'row' },
  statusCardPaid: { backgroundColor: Colors.successLight, borderColor: Colors.success },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  statusIcon: { fontSize: 32 },
  statusInfo: { gap: 4 },
  statusTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  amountCard: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderColor: Colors.primaryLight,
  },
  amountLabel: { fontSize: FontSize.sm, color: Colors.primaryDark },
  amountValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginVertical: Spacing.xs,
  },
  amountNote: { fontSize: FontSize.sm, color: Colors.primaryDark },
  bankCard: { marginBottom: Spacing.md },
  bankTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginBottom: Spacing.md,
  },
  qrIcon: { fontSize: 56, marginBottom: Spacing.sm },
  qrImage: { width: 220, height: 220 },
  qrText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4, marginTop: Spacing.sm },
  qrAmount: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.primary },
  bankDivider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.md },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bankLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  bankValue: { fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium, flex: 2, textAlign: 'right' },
  bankValueHighlight: { color: Colors.primary, fontWeight: FontWeight.bold, fontSize: FontSize.base },
  noteBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
  },
  noteText: { fontSize: FontSize.xs, color: Colors.warning },
  cashCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  cashIcon: { fontSize: 48, marginBottom: Spacing.sm },
  cashTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  cashText: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  btn: { marginBottom: Spacing.sm },
});
