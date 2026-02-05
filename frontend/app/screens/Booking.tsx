import React,{useState} from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/themed-view';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Booking() {
  const router = useRouter();
  const navigation = useNavigation();
  const [guestCount, setGuestCount] = useState(0);
  const dates = [
    { id: 1, day: 'Mon', date: '01', month: 'Jan' },
    { id: 2, day: 'Mon', date: '01', month: 'Jan' }, 
    { id: 3, day: 'Mon', date: '01', month: 'Jan' },
    { id: 4, day: 'Mon', date: '01', month: 'Jan' },
    { id: 5, day: 'Mon', date: '01', month: 'Jan' },
  ];
  const times = ['08:00 AM','10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];
  const gotoConfirm = () => {
    router.push('/screens/Confirm');
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Book a Table</Text>
          <Text style={styles.headerSubtitle}>Name</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* --- SECTION: SELECT DATE --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* Icon Calendar */}
            <FontAwesome name="calendar" size={20} color="#333" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
            {dates.map((item, index) => (
              <TouchableOpacity key={index} style={styles.dateCard}>
                <Text style={styles.dateDay}>{item.day}</Text>
                <Text style={styles.dateNum}>{item.date}</Text>
                <Text style={styles.dateMonth}>{item.month}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- SECTION: SELECT TIME --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* Icon Clock */}
            <FontAwesome name="clock-o" size={22} color="#333" />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>

          <View style={styles.timeContainer}>
            {times.map((time, index) => (
              <TouchableOpacity key={index} style={styles.timeButton}>
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- SECTION: NUMBER OF GUESTS --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* Icon Users/People */}
            <FontAwesome name="users" size={20} color="#333" />
            <Text style={styles.sectionTitle}>Number of Guests</Text>
          </View>

          <View style={styles.guestControlContainer}>
            <TouchableOpacity 
              style={styles.circleButton}
              onPress={() => setGuestCount(Math.max(0, guestCount - 1))}
            >
              {/* Icon Minus */}
              <FontAwesome name="minus" size={18} color="#333" />
            </TouchableOpacity>

            <View style={styles.guestInfo}>
              <Text style={styles.guestNumber}>
                 {guestCount < 10 ? `0${guestCount}` : guestCount}
              </Text>
              <Text style={styles.guestLabel}>Guests</Text>
            </View>

            <TouchableOpacity 
              style={styles.circleButton}
              onPress={() => setGuestCount(guestCount + 1)}
            >
              {/* Icon Plus */}
              <FontAwesome name="plus" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- SECTION: SPECIAL REQUEST --- */}
        <View style={styles.section}>
          <Text style={styles.labelRequest}>Special Request (Optional)</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            placeholder="e.g. Occasion, Allergies..."
            textAlignVertical="top"
          />
        </View>

        {/* --- BUTTON NEXT --- */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => gotoConfirm()}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
    padding: 0,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  
  // Section Common Styles
  section: {
    marginTop: 5,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },

  // Date Styles
  dateList: {
    flexGrow: 0,
  },
  dateCard: {
    width: 70,
    height: 90,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  dateDay: { fontSize: 12, color: '#666' },
  dateNum: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 2 },
  dateMonth: { fontSize: 12, color: '#666' },

  // Time Styles
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },

  // Guests Styles
  guestControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestInfo: {
    alignItems: 'center',
  },
  guestNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  guestLabel: {
    fontSize: 14,
    color: '#666',
  },

  // Special Request
  labelRequest: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 15,
    height: 100,
    backgroundColor: '#fff',
    fontSize: 16,
  },

  // Footer Button
  nextButton: {
    backgroundColor: '#FF9A62',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});