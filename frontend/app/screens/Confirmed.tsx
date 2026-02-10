import React from 'react';
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
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import BookingDetailRow from '@/components/ui/BookingDetailRow';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function Confirmed() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.bookInfo}>
        <FontAwesome name="check-circle" size={150} color="#4BB543" />
        <Text style={styles.bookConfirmed}>Your booking is confirmed!</Text>
        <Text style={styles.bookDetails}>Your table has been successfully reserved. We'll send you a confirmation email shortly.</Text>
      </View>

      <View style={styles.infoDetailsWrapper}>
        <View style={styles.bookID}>
          <Text style={styles.bookIDLabel}>Booking ID</Text>
          <Text style={styles.bookIDValue}>#TB-03XX-78XX</Text>
        </View>
        <View style={styles.detailsContainer}>
          <BookingDetailRow iconName="calendar" label="Date" value="Monday, May 15, 2026" style={{ borderWidth: 0 }} />
          <BookingDetailRow iconName="clock-o" label="Time" value="7:00 PM" style={{ borderWidth: 0 }} />
          <BookingDetailRow iconName="user" label="Guest" value="2 People" style={{ borderWidth: 0 }} />
          <BookingDetailRow iconName="location-dot" iconFamily="FontAwesome6" label="Restaurant" value="Name" style={{ borderWidth: 0 }} />
        </View>
      </View>
      <PrimaryButton
        title="View My Booking"
        onPress={() => router.push('/(tabs)/booking')}
        style={styles.mainButton1}
        textStyle={styles.mainButtonText1}
      />
      <PrimaryButton
        title="Back to Home"
        onPress={() => router.replace('/(tabs)/home')}
        style={styles.mainButton2}
        textStyle={styles.mainButtonText2}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bookInfo: {
    marginTop: 50,
    alignItems: 'center',
  },
  bookConfirmed: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  bookDetails: {
    fontSize: 14,
    width: '70%',
    textAlign: 'center',
    color: '#dcdcdc',
  },
  infoDetailsWrapper: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bookID: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    alignItems: 'center',
  },
  bookIDLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Arial',
    color: '#dcdcdc',
  },
  bookIDValue: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  detailsContainer: {
    padding: 10,
  },
  detailItem: {
    width: '95%',
    flexDirection: 'row',
    padding: 5,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 14,
    color: '#dcdcdc',
    fontFamily: 'Arial',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  mainButton1: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ff9e6b',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  mainButtonText1: {
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  mainButton2: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#bdbdbd',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  mainButtonText2: {
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
