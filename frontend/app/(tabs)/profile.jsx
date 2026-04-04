import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import FormInput from '@/components/admin/FormInput';
import Button from '@/components/ui/Button';
import Card from '@/components/common/Card';
import SectionHeader from '@/components/common/SectionHeader';

const API_BASE = 'http://192.168.1.9:5001/api';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    phone: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

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
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
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
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('accessToken');
          await AsyncStorage.removeItem('refreshToken');
          await AsyncStorage.removeItem('userRole');
          router.replace('/screens/Signin');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner fullScreen />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-circle" size={64} color="#ff9e6b" />
        </View>
        <Text style={styles.displayName}>{user?.displayName || user?.username}</Text>
        <Text style={styles.role}>{user?.role || 'User'}</Text>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <SectionHeader title="Account Information" />
        <Card>
          <InfoRow icon="account" label="Username" value={user?.username} />
          <InfoRow icon="email" label="Email" value={user?.email} />
          <InfoRow
            icon="calendar"
            label="Member Since"
            value={new Date(user?.createdAt).toLocaleDateString('vi-VN')}
          />
        </Card>
      </View>

      {/* Edit Profile */}
      {!isEditing ? (
        <>
          <View style={styles.section}>
            <SectionHeader title="Profile Details" />
            <Card>
              <InfoRow label="Display Name" value={user?.displayName || '-'} />
              <InfoRow label="Phone" value={user?.phone || '-'} />
              <InfoRow label="Bio" value={user?.bio || '-'} />
            </Card>
          </View>

          <View style={styles.section}>
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            />
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <SectionHeader title="Edit Profile" />
          <Card style={styles.formCard}>
            <FormInput
              label="Display Name"
              placeholder="Your name"
              value={formData.displayName}
              onChangeText={(text) => setFormData({ ...formData, displayName: text })}
              editable={!updating}
            />

            <FormInput
              label="Phone"
              placeholder="+84..."
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              editable={!updating}
              style={{ marginTop: 12 }}
            />

            <FormInput
              label="Bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              editable={!updating}
              style={{ marginTop: 12 }}
            />

            <View style={styles.buttons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
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
                title="Save Changes"
                onPress={handleUpdate}
                disabled={updating}
                style={styles.submitBtn}
              />
            </View>
          </Card>
        </View>
      )}

      {/* Preferences */}
      <View style={styles.section}>
        <SectionHeader title="Preferences" />
        <Card>
          <TouchableOpacity style={styles.prefRow}>
            <View style={styles.prefContent}>
              <MaterialCommunityIcons name="bell" size={20} color="#ff9e6b" />
              <Text style={styles.prefLabel}>Notifications</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.prefRow, styles.prefRowBorder]}>
            <View style={styles.prefContent}>
              <MaterialCommunityIcons name="lock" size={20} color="#ff9e6b" />
              <Text style={styles.prefLabel}>Privacy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.prefRow, styles.prefRowBorder]}>
            <View style={styles.prefContent}>
              <MaterialCommunityIcons name="help-circle" size={20} color="#ff9e6b" />
              <Text style={styles.prefLabel}>Help & Support</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutBtn}
          textStyle={styles.logoutText}
        />
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      {icon && <MaterialCommunityIcons name={icon} size={18} color="#ff9e6b" />}
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    marginBottom: 12,
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  role: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formCard: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  prefRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  prefContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
  editButton: {
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#ef4444',
  },
  footer: {
    height: 20,
  },
});