import React, { useState, useEffect } from 'react';
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
import { signin } from '@/src/services/auth.service';
import useAuthStore from '@/src/store/authStore';
import Input from '@/src/components/common/Input';
import Button from '@/src/components/common/Button';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';

export default function SigninScreen() {
  const router = useRouter();
  const { user, login, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isLoading && user) {
      redirectByRole(user.role);
    }
  }, [user, isLoading]);

  const redirectByRole = (role) => {
    if (role === 'admin') {
      router.replace('/(admin)/dashboard');
    } else {
      router.replace('/(user)/home');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await signin(username.trim().toLowerCase(), password);
      if (res.data?.accessToken && res.data?.user) {
        await login(res.data.user, res.data.accessToken);
        redirectByRole(res.data.user.role);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      Alert.alert('Lỗi đăng nhập', message);
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
            <Text style={styles.title}>Chào mừng trở lại</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Tên đăng nhập"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors((e) => ({ ...e, username: '' }));
              }}
              placeholder="Nhập tên đăng nhập"
              error={errors.username}
              autoCapitalize="none"
            />

            <Input
              label="Mật khẩu"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((e) => ({ ...e, password: '' }));
              }}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              error={errors.password}
            />

            <Button
              title="Đăng nhập"
              onPress={handleSignin}
              loading={loading}
              style={styles.submitButton}
              size="lg"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <Text
              style={styles.link}
              onPress={() => router.push('/(auth)/signup')}
            >
              Đăng ký ngay
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
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
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
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
