import React from 'react';
import { ThemedView } from '@/components/themed-view';
import { router, useRouter } from 'expo-router';
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
const gotoConfirmed = () => {
  router.push('/screens/Confirmed');
}
export default function Confirm() {
  const router = useRouter();
  return(
    <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          
          {/* --- FIXED HEADER --- */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              {/* Icon Back */}
              <FontAwesome name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Confirm Booking</Text>
            </View>
          </View>
          
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.content}
            scrollEventThrottle={16}
          >
          <View style={styles.confirmCard}>
          <View style={styles.resAvatarSmall} />
          <View style={styles.resInfo}>
            <Text style={styles.resNameBold}>NAME RESTAURANT</Text>
            <Text style={styles.resType}>Type</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Booking Detail</Text>
        <View style={styles.detailRow}>
          <View style={[styles.detailItem, {marginLeft: 10}]}>
            <FontAwesome style={{marginLeft: 5}} name="calendar" size={20} color="#666" />
            <View>
            <Text style={styles.subLabel}>Date</Text>
            <Text style={styles.infoText}>Monday, May 15, 2026</Text>
            </View>
          </View>
          <View style={[styles.detailItem, {marginLeft: 10}]}>
            <FontAwesome style={{marginLeft: 5}} name="clock-o" size={20} color="#666" />
            <View>
            <Text style={styles.subLabel}>Time</Text>
            <Text style={styles.infoText}>7:00 PM</Text>
            </View>
          </View>
          <View style={[styles.detailItem, {marginLeft: 10}]}>
            <FontAwesome style={{marginLeft: 5}} name="user" size={20} color="#666" />
            <View>
            <Text style={styles.subLabel}>Guest</Text>
            <Text style={styles.infoText}>2 People</Text>
            </View>
          </View>
        </View>
        <Text style={styles.cusInfo}>Your Infomation</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <TextInput style={styles.inputBox}/>
          <Text style={styles.infoLabel}>Phone Number</Text>
          <TextInput style={styles.inputBox}/>
          <Text style={styles.infoLabel}>Email Address</Text>
          <TextInput style={styles.inputBox}/>
          <Text style={styles.rqLabel}>Special Request</Text>
          <TextInput style={styles.rqBox}></TextInput>
        </View>
        <TouchableOpacity style={[styles.mainButton]}
          onPress={() => gotoConfirmed()}>
          <Text style={styles.mainButtonText}>CONFIRM</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
    marginTop: 45,
    borderBlockColor: '#000',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    zIndex: 100,
    position: 'relative',
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
    fontFamily: 'Arial',
    letterSpacing: 1,
  },
  confirmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5e6cc',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  resAvatarSmall: {
    width: 70,
    height: 60,
    backgroundColor: '#ff8787',
    borderRadius: 10,
  },
  resInfo: {
    marginLeft: 8,
    bottom: 10,
  },
  resNameBold: {
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: 18,
  },
  resType: {
    color: '#666',
    fontFamily: 'Arial',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    padding: 10,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    alignItems: 'center',
  },
  detailItem: {
    backgroundColor: '#fff',
    width: '95%',
    flexDirection: 'row',
    padding: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Arial',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  cusInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    paddingLeft: 10,
    marginTop: -15,
  },
  infoRow: {
    paddingLeft: 10,
    width: '97.5%',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Arial',
    marginBottom: 3,
  },
  inputBox: {
    height: 40,
    marginBottom: 3,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  rqLabel: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    marginTop: 10,
  },
  rqBox: {
    height: 80,
    marginTop: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  mainButton: {
    backgroundColor: '#ff9e6b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
    width: '95%',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
