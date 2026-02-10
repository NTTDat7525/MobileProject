import React,{useState} from 'react';
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
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function main() {
    return (
        <View style={styles.container}>
            {/* Image */}
            <View style={styles.image}></View>
            <View style={styles.body}>
              <Text style={styles.resName}>The Grand Cellar</Text>
              
              <View style={styles.introduce}>
                <Text style={styles.textIntroduce}>An elegant European-style restaurant</Text> 
                <Text style={styles.textIntroduce}>with vintage décor, fine wines, </Text>
                <Text style={styles.textIntroduce}>and authentic French–Italian cuisine.</Text>
                <Text style={styles.textIntroduce}>Perfect for romantic dinners</Text> 
                <Text style={styles.textIntroduce}>or refined gatherings in a timeless setting.</Text>
              </View>

              <PrimaryButton
                title="Get Started"
                onPress={() => router.push('/screens/Signin')}
                style={styles.startButton}
                textStyle={styles.startButtonText}
              />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    padding: 13,
  },
  image: {
    position: 'relative',
    backgroundColor: '#ff8787',
    height: 244,
    width: '100%',
    marginTop: 50,
    borderRadius : 15,
  },
  body:{
    marginTop: 30,
  },
  resName: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  introduce: {
   
  },
  textIntroduce: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#ff9e6b',
    padding: 10,
    top: 180,

    borderRadius: 15,
  },
  startButtonText: {
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'normal',
    textAlign: 'center',
  },
})