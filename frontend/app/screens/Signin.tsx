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

export default function Signin() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue booking</Text>

            <Text style={styles.label}>Username</Text>
            <View style={styles.inputBox}>
                <FontAwesome name="user" size={18} color="#999" />
                <TextInput
                placeholder="Enter your username"
                style={styles.input}
                />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputBox}>
                <FontAwesome name="lock" size={18} color="#999" />
                <TextInput
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
                />
            </View>

            <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>

            {/* --- OR --- */}
            <Text style={styles.orText}>or continue with</Text>

            {/* --- GOOGLE BUTTON --- */}
            <TouchableOpacity style={styles.googleButton}>
                <Text style={styles.googleText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text 
                    style={styles.signupLink}
                    onPress={() => router.push('/screens/Signup')}
                >
                    Sign Up.
                </Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },

  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 6,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  continueButton: {
    backgroundColor: '#FFA26B',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  orText: {
    textAlign: 'center',
    color: '#bbb',
    marginVertical: 20,
    fontSize: 13,
  },

  googleButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleText: {
    fontSize: 15,
    color: '#333',
  },

  signupText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#666',
  },

  signupLink: {
    color: '#FFA26B',
    fontWeight: '600',
  },
})