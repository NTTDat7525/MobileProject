import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signup } from '@/src/services/auth.service';
import Input from '@/src/components/common/Input';
import Button from '@/src/components/common/Button';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';

export default function SignupScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!form.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.length < 6) {
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({
        username: form.username.trim().toLowerCase(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      Alert.alert('Thành công', 'Tài khoản đã được tạo. Vui lòng đăng nhập.', [
        { text: 'Đăng nhập', onPress: () => router.replace('/(auth)/signin') },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi đăng ký', message);
    } finally {
      setLoading(false);
    }
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
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>
          </View>

          <View style={styles.form}>

            <Input
              label="Tên đăng nhập"
              value={form.username}
              onChangeText={setField('username')}
              placeholder="username123"
              error={errors.username}
            />

            <Input
              label="Email"
              value={form.email}
              onChangeText={setField('email')}
              placeholder="email@example.com"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Mật khẩu"
              value={form.password}
              onChangeText={setField('password')}
              placeholder="Tối thiểu 6 ký tự"
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChangeText={setField('confirmPassword')}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Đăng ký"
              onPress={handleSignup}
              loading={loading}
              style={styles.submitButton}
              size="lg"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <Text style={styles.link} onPress={() => router.back()}>
              Đăng nhập
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },

  form: {
    marginBottom: Spacing.lg
  },

  halfInput: {
    flex: 1
  },

  submitButton: {
    marginTop: Spacing.sm
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },

  footerText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  
  link: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
