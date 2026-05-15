import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createBooking } from '@/src/services/booking.service';
import useAuthStore from '@/src/store/authStore';
import Input from '@/src/components/common/Input';
import Button from '@/src/components/common/Button';
import Card from '@/src/components/common/Card';
import DateTimeModalPicker from '@/src/components/common/DateTimePicker';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';

const PAYMENT_METHODS = [
  { value: 'tiền mặt', label: 'Tiền mặt' },
  { value: 'chuyển khoản ngân hàng', label: 'Chuyển khoản' },
];

export default function BookingScreen() {
  const router = useRouter();
  const { tableId, tableName, price, capacity } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const initialContact = useMemo(() => ({
    guestEmail: user?.email ?? '',
    guestPhone: user?.phone ?? '',
  }), [user?.email, user?.phone]);

  const [form, setForm] = useState({
    time: '',
    numberOfGuests: '1',
    guestEmail: initialContact.guestEmail,
    guestPhone: initialContact.guestPhone,
    specialRequests: '',
    PaymentMethod: 'tiền mặt',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      guestEmail: prev.guestEmail || initialContact.guestEmail,
      guestPhone: prev.guestPhone || initialContact.guestPhone,
    }));
  }, [initialContact]);

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.time.trim()) {
      newErrors.time = 'Vui lòng nhập thời gian';
    } else {
      const date = new Date(form.time);
      if (isNaN(date.getTime())) newErrors.time = 'Định dạng ngày không hợp lệ (YYYY-MM-DD HH:MM)';
      else if (date < new Date()) newErrors.time = 'Thời gian phải ở tương lai';
    }
    const guests = parseInt(form.numberOfGuests, 10);
    if (!form.numberOfGuests || isNaN(guests) || guests < 1) {
      newErrors.numberOfGuests = 'Số khách tối thiểu là 1';
    } else if (capacity && guests > parseInt(capacity, 10)) {
      newErrors.numberOfGuests = `Bàn chỉ chứa tối đa ${capacity} khách`;
    }
    if (!form.guestEmail.trim()) {
      newErrors.guestEmail = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.guestEmail)) {
      newErrors.guestEmail = 'Email không hợp lệ';
    }
    if (!form.guestPhone.trim()) {
      newErrors.guestPhone = 'Vui lòng nhập số điện thoại';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await createBooking({
        tableId,
        time: new Date(form.time).toISOString(),
        numberOfGuests: parseInt(form.numberOfGuests, 10),
        guestEmail: form.guestEmail.trim(),
        guestPhone: form.guestPhone.trim(),
        specialRequests: form.specialRequests.trim(),
        PaymentMethod: form.PaymentMethod,
      });
      const bookingId = res.data?.booking?.id ?? res.data?.id;
      router.replace({
        pathname: '/(user)/confirmation',
        params: { bookingId },
      });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Đặt bàn thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
    }
  };

  const adjustGuests = (delta) => {
    const current = parseInt(form.numberOfGuests, 10) || 1;
    const next = Math.max(1, Math.min(parseInt(capacity, 10) || 30, current + delta));
    setField('numberOfGuests')(String(next));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Hoàn tất đặt bàn</Text>
          <Text style={styles.pageSubtitle}>Kiểm tra thông tin và chọn cách thanh toán phù hợp.</Text>

          <Card style={styles.tableInfoCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="restaurant-outline" size={22} color={Colors.primary} />
              <Text style={styles.tableInfoTitle}>{tableName}</Text>
            </View>
            <Text style={styles.tableInfoSub}>
              Sức chứa: {capacity} khách • Giá:{' '}
              {Number(price).toLocaleString('vi-VN')} ₫
            </Text>
          </Card>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin đặt bàn</Text>

            <DateTimeModalPicker
              value={form.time}
              onChange={setField('time')}
              error={errors.time}
            />

            <Text style={styles.label}>Số lượng khách</Text>
            <View style={styles.counter}>
              <TouchableOpacity style={styles.counterBtn} onPress={() => adjustGuests(-1)}>
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{form.numberOfGuests}</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={() => adjustGuests(1)}>
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {errors.numberOfGuests && (
              <Text style={styles.errorText}>{errors.numberOfGuests}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <Input
              label="Email"
              value={form.guestEmail}
              onChangeText={setField('guestEmail')}
              placeholder="email@example.com"
              keyboardType="email-address"
              error={errors.guestEmail}
            />
            <Input
              label="Số điện thoại"
              value={form.guestPhone}
              onChangeText={setField('guestPhone')}
              placeholder="0912345678"
              keyboardType="phone-pad"
              error={errors.guestPhone}
            />
            <Input
              label="Yêu cầu đặc biệt (tuỳ chọn)"
              value={form.specialRequests}
              onChangeText={setField('specialRequests')}
              placeholder="Ví dụ: Sinh nhật, dị ứng thực phẩm..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.value}
                style={[
                  styles.paymentOption,
                  form.PaymentMethod === method.value && styles.paymentOptionActive,
                ]}
                onPress={() => setField('PaymentMethod')(method.value)}
              >
                <View
                  style={[
                    styles.radio,
                    form.PaymentMethod === method.value && styles.radioActive,
                  ]}
                >
                  {form.PaymentMethod === method.value ? <View style={styles.radioDot} /> : null}
                </View>
                <Text style={styles.paymentLabel}>{method.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Xác nhận đặt bàn"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  backBtn: { marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  backText: { fontSize: FontSize.base, color: Colors.primary, fontWeight: FontWeight.medium },
  pageTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  tableInfoCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.primaryLight,
    marginBottom: Spacing.lg,
  },
  tableInfoTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  tableInfoSub: { fontSize: FontSize.sm, color: Colors.primaryDark, marginTop: 4 },
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  counterBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  counterBtnText: { fontSize: FontSize.xl, color: Colors.primary, fontWeight: FontWeight.bold },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  errorText: { fontSize: FontSize.xs, color: Colors.error, marginTop: -Spacing.sm, marginBottom: Spacing.sm },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary, backgroundColor: Colors.white },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  paymentLabel: { fontSize: FontSize.base, color: Colors.text },
  submitBtn: { marginTop: Spacing.sm },
});
