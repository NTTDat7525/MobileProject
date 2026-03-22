import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import {router} from 'expo-router'
import {useEffect, useState} from 'react'
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Axios from "axios"


export default function SigninForm({username, setUsername, password, setPassword, onSubmit, loading = false}) {
  return (
    <View>
      <Input
        label="Username"
        placeholder="Enter your username"
        iconName="user"
        value={username}
        onChangeText={setUsername}
        editable={!loading}/>

      <Input
        label="Password"
        placeholder="Enter your password"
        iconName="lock"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}/>

      <Button
        title={loading ? "Đang đăng nhập..." : "Continue"}
        onPress={onSubmit}
        style={[styles.continueButton, loading && styles.buttonDisabled]}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator 
          size="small" 
          color="#FFA26B" 
          style={styles.loader}
        />
      )}

      <Text style={styles.orText}>or continue with</Text>

      <GoogleSignInButton />
    </View>
  );
}
const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: "#FFA26B",
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loader: {
    marginTop: 8,
  },
  orText: {
    textAlign: "center",
    color: "#bbb",
    marginVertical: 20,
    fontSize: 13,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },

});
