import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import UserHeader from '@/components/user/UserHeader';
import FormInput from '@/components/admin/FormInput';
import Button from '@/components/ui/Button';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    phone: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data.user;
      setUser(userData);
      setFormData({
        displayName: userData.displayName || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
      });
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Error', 'Lỗi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const token = await AsyncStorage.getItem('accessToken');

      const response = await axios.put(`${API_BASE}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <UserHeader title="My Profile" showBack />
        <ActivityIndicator size="large" color="#ff9e6b" style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserHeader title="My Profile" showBack />

      <ScrollView style={styles.content}>
        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Tên đăng nhập</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={[styles.infoValue, { textTransform: 'capitalize' }]}>
              {user?.role || 'User'}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {new Date(user?.createdAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>

        {/* Edit Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thay đổi hồ sơ</Text>

          <FormInput
            label="Tên hiển thị"
            placeholder="Your name"
            value={formData.displayName}
            onChangeText={(text) => setFormData({ ...formData, displayName: text })}
          />

          <FormInput
            label="Số điện thoại"
            placeholder="+84..."
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />

          <FormInput
            label="Giới thiệu"
            placeholder="Mô tả 1 vài điều về bản thân"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
          />

          <View style={styles.buttons}>
            <Button
              title="Hủy"
              onPress={() => {
                setFormData({
                  displayName: user.displayName || '',
                  bio: user.bio || '',
                  phone: user.phone || '',
                });
              }}
              style={styles.cancelBtn}
              textStyle={styles.cancelText}
              disabled={updating}
            />
            <Button
              title="Lưu thay đổi"
              onPress={handleUpdate}
              disabled={updating}
              style={styles.submitBtn}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>

          <Button
            title="Đăng xuất"
            onPress={() => {
              Alert.alert('Đăng xuất', 'Bạn chắc chắn muốn đăng xuất?', [
                { text: 'Hủy' },
                {
                  text: 'Xác nhận',
                  onPress: async () => {
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    router.replace('/screens/Signin');
                  },
                },
              ]);
            }}
            style={styles.logoutBtn}
            textStyle={styles.logoutText}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loader: {
    marginTop: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  cancelText: {
    color: '#6b7280',
  },
  submitBtn: {
    flex: 1,
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
  },
});
