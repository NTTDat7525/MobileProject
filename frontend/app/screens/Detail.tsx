import React from 'react';
import { ThemedView } from '@/components/themed-view';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  StatusBar 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Detail() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPlaceholder} />
          <TouchableOpacity style={styles.backButtonDetail}>
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          {/* Card trắng đè lên ảnh */}
          <View style={styles.bannerOverlayCards}>
            <View style={styles.smallCard} />
            <View style={styles.smallCard} />
            <View style={styles.smallCard} />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.resName}>Name restaurant</Text>
          <Text style={styles.describe}>Describe</Text>

          <Text style={styles.sectionTitle}>Service</Text>
          <View style={styles.serviceGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.serviceItem} ><Text style={styles.serviceItemText}>NAME</Text></View>
            ))}
          </View>

          <View style={styles.contactCard}>
            <View>
              <Text style={styles.contactTitle}>Contact</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name="phone" size={20} color="#666" />
                <Text style={styles.phoneNumber}> +84 394782XXX</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callText}>CALL</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.mainButtonText}>Book a Table</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    position: 'relative',
    backgroundColor: '#ff8787',
    height: 250,
    width: '100%',
    marginTop: 50,
  },
  bannerPlaceholder: {
  },
  backButtonDetail: {
    margin: 10,
    padding: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOverlayCards: {
    position: 'absolute',
    width: '75%',
    bottom: 0,
    left: '27%',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
  },
  smallCard: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 15,
  },
  body: {
    padding: 10,
  },
  resName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  describe: {
    paddingLeft: 10,
    marginTop: 5,
    fontFamily: 'Arial',
    color: '#dadada',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    marginTop: 5,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '95%',
    left: '2.5%',
  },
  serviceItem: {
    width: '48%',
    height: 40,
    backgroundColor: 'wheat',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 10,
  },
  serviceItemText: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 15,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    borderColor: '#dadada',
    borderWidth: 1,
    marginBottom: 20,
  },
  contactTitle: {
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: 20,
  },
  phoneNumber: {
    fontFamily: 'Arial',
    fontSize: 15,
    color: '#dadada',
  },
  callButton: {
    backgroundColor: 'transparent',
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dadada',
  },
  callText: {
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: 15,
  },
  mainButton: {
    backgroundColor: '#ff9e6b',
    padding: 10,
    top: 100,
    borderRadius: 15,
  },
  mainButtonText: {
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
  }
});