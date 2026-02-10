import React, { useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  SafeAreaViewBase
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import BookingCard from '@/components/ui/BookingCard';
import BookingTabs from '@/components/ui/BookingTabs';

export default function Upcoming() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const bookings = [
    {
      id: 1,
      name: 'NAME RESTAURANT',
      type: 'Type',
      date: 'Mon, May 16, 2026',
      time: '7 PM',
      guests: '2 Guests',
      bookingID: '#TB-03XX-78XX',
    },
    {
      id: 2,
      name: 'NAME RESTAURANT',
      type: 'Type',
      date: 'Mon, May 16, 2026',
      time: '7 PM',
      guests: '2 Guests',
      bookingID: '#TB-03XX-78XX',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      
      {/* --- FIXED HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* --- TABS --- */}
      <BookingTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* --- SCROLLABLE BOOKINGS LIST --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            variant="upcoming"
            onEdit={() => router.push('/screens/Booking')}
            onCancel={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 5,
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  tabsContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingHorizontal: 1,
    paddingBottom: 3,
    paddingTop: 3,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dcdcdc',
  },
  tab1: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginLeft: 3,
  },
  tab2: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginRight: 3,
  },
  tabActive: {
    backgroundColor: '#f5e6cc',
    borderColor: '#f5e6cc',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    fontFamily: 'Arial',
  },
  tabTextActive: {
    color: '#333',
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 70,
    height: 70,
    backgroundColor: '#ff8787',
    borderRadius: 10,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  resName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    marginBottom: 2,
  },
  resType: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Arial',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Arial',
  },
  cardBottom: {
    flexDirection: 'row',
    gap: 10,
  },
  modifyBtn: {
    flex: 1,
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modifyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Arial',
  },
  cancelBtn: {
    backgroundColor: '#ffb3ba',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Arial',
  },
  bookingID: {
    fontSize: 11,
    color: '#ccc',
    fontFamily: 'Arial',
    marginTop: 10,
  },
});