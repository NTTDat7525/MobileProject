import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Signup() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Sign up to start booking amazing restaurants
      </Text>

      {/* --- USERNAME --- */}
      <Text style={styles.label}>Username</Text>
      <View style={styles.inputBox}>
        <FontAwesome name="user" size={18} color="#999" />
        <TextInput
          placeholder="Enter your username"
          style={styles.input}
        />
      </View>

      {/* --- PASSWORD --- */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputBox}>
        <FontAwesome name="lock" size={18} color="#999" />
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* --- CONFIRM PASSWORD --- */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputBox}>
        <FontAwesome name="lock" size={18} color="#999" />
        <TextInput
          placeholder="Confirm your password"
          secureTextEntry
          style={styles.input}
        />
      </View>


      {/* --- BUTTON --- */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or continue with</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text style={styles.linkText}>Sign In.</Text>
      </Text>
    </ScrollView>
  );
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

  primaryButton: {
    backgroundColor: '#FFA26B',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  primaryText: {
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

  bottomText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#666',
  },

  linkText: {
    color: '#FFA26B',
    fontWeight: '600',
  },
});