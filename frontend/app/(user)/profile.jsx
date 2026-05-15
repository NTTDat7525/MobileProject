import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { updateProfile, signout } from '@/src/services/auth.service';
import useAuthStore from '@/src/store/authStore';
import Input from '@/src/components/common/Input';
import Button from '@/src/components/common/Button';
import Card from '@/src/components/common/Card';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    phone: user?.phone ?? '',
    bio: user?.bio ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile({ phone: form.phone, bio: form.bio });
      await updateUser(res.data?.user ?? { phone: form.phone, bio: form.bio });
      setEditing(false);
      Alert.alert('Thành công', 'Hồ sơ đã được cập nhật.');
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try { await signout(); } catch { /* ignore */ }
          await logout();
          router.replace('/(auth)/signin');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(user?.username ?? '?')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.username ?? '–'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? '–'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
            </Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Thông tin cá nhân</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editLink}>Chỉnh sửa</Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <>
              <Input
                label="Số điện thoại"
                value={form.phone}
                onChangeText={setField('phone')}
                placeholder="0912345678"
                keyboardType="phone-pad"
                error={errors.phone}
              />
              <Input
                label="Giới thiệu bản thân"
                value={form.bio}
                onChangeText={setField('bio')}
                placeholder="Viết gì đó về bạn..."
                multiline
                numberOfLines={3}
                error={errors.bio}
              />
              <View style={styles.editActions}>
                <Button
                  title="Lưu thay đổi"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.saveBtn}
                />
                <Button
                  title="Huỷ"
                  variant="outline"
                  onPress={() => {
                    setForm({ phone: user?.phone ?? '', bio: user?.bio ?? '' });
                    setEditing(false);
                  }}
                  style={styles.cancelBtn}
                />
              </View>
            </>
          ) : (
            <>
              <InfoRow label="Tên đăng nhập" value={user?.username} />
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="Số điện thoại" value={user?.phone || 'Chưa cập nhật'} />
              <InfoRow label="Giới thiệu" value={user?.bio || 'Chưa cập nhật'} />
            </>
          )}
        </Card>

        <Card style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push('/(user)/history')}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionLabel}>Lịch sử đặt bàn</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </Card>

        <Button
          title="Đăng xuất"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutBtn}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value ?? '–'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xl },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 4,
  },
  avatarText: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.white },
  userName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  roleBadge: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
  },
  roleText: { fontSize: FontSize.sm, color: Colors.primaryDark, fontWeight: FontWeight.medium },
  infoCard: { marginBottom: Spacing.md },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  editLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  infoValue: { flex: 2, fontSize: FontSize.sm, color: Colors.text, textAlign: 'right' },
  editActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  saveBtn: { flex: 1 },
  cancelBtn: { flex: 1 },
  actionsCard: { marginBottom: Spacing.lg },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  actionLabel: { flex: 1, fontSize: FontSize.base, color: Colors.text, marginLeft: Spacing.sm },
  logoutBtn: {},
});