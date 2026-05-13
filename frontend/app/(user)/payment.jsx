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
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';

const BANK_INFO = {
  bankName: 'VNPay',
  accountNumber: '1234567890',
  accountName: 'Golden Spoon Restaurant',
  branch: 'Chi nhánh Hà Nội',
};

export default function PaymentScreen() {
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
      setError('Không thể tải thông tin thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error || 'Không tìm thấy thông tin thanh toán'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isPaid = booking.paymentStatus === 'đã thanh toán';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Quay lại</Text>
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
              <QRCode
                value={`BANK:${BANK_INFO.accountNumber}|AMOUNT:${booking.totalPrice}|CONTENT:DAT BAN ${bookingId}`}
                size={180}
              />
              <Text style={styles.qrText}>Quét mã để thanh toán</Text>
              <Text style={styles.qrAmount}>{formatPrice(booking.totalPrice)}</Text>
            </View>

            <View style={styles.bankDivider} />

            <BankRow label="Ngân hàng" value={BANK_INFO.bankName} />
            <BankRow label="Số tài khoản" value={BANK_INFO.accountNumber} copyable />
            <BankRow label="Chủ tài khoản" value={BANK_INFO.accountName} />
            <BankRow label="Chi nhánh" value={BANK_INFO.branch} />
            <BankRow
              label="Nội dung CK"
              value={`DAT BAN ${bookingId?.slice(0, 8).toUpperCase()}`}
              copyable
            />
            <BankRow label="Số tiền" value={formatPrice(booking.totalPrice)} highlight />

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Vui lòng ghi đúng nội dung chuyển khoản để xác nhận tự động.
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
  backBtn: { marginBottom: Spacing.sm },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.medium },
  pageTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
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
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
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
