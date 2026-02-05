import React from 'react';
import { ThemedView } from '@/components/themed-view';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router,useRouter } from 'expo-router';
const gotoLogin = () => {
  Alert.alert(
    'Log Out',
    'Are you sure you want to log out?',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Log Out',
        onPress: () => router.push('/screens/Signin'),
        style: 'destructive',
      },
    ]
  );
}
export default function Profile() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/screens/Main');
  };
  return (
  <>
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- HEADER SECTION --- */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity>
            <FontAwesome name="pencil" style={styles.editIcon} size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.userName}>Jack and Sol</Text>
        </View>

        {/* --- CONTACT INFO CARD --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          {/* Email Row */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <FontAwesome name="envelope-o" size={18} color="#333" />
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>Monday, May 15, 2026</Text>
            </View>
          </View>

          {/* Phone Row */}
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <FontAwesome name="phone" size={20} color="#333" />
            </View>
            <View>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>+84 9478XXXX</Text>
            </View>
          </View>

          {/* Restaurant Row */}
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.iconBox}>
              <FontAwesome name="map-marker" size={22} color="#333" />
            </View>
            <View>
              <Text style={styles.label}>Restaurant</Text>
              <Text style={styles.value}>Name</Text>
            </View>
          </View>
        </View>

        {/* --- LOG OUT BUTTON --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
          <FontAwesome name="sign-out" size={18} color="#FF9A9E"/>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>

      {/* --- LOGOUT MODAL --- */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome name="sign-out" size={40} color="#FF9A9E" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutButtonModal]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editIcon: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#FF9A9E', // Màu hồng cam như trong ảnh
    borderRadius: 15,
    marginRight: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 150, // Khoảng cách tới nút logout
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
  },
  iconBox: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  label: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#FF9A9E',
    borderRadius: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF9A9E',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButtonModal: {
    backgroundColor: '#FF9A9E',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
