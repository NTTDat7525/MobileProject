import { ScrollView, StyleSheet, StatusBar, Text, View, KeyboardAvoidingView, Platform } from "react-native";
import SignupForm from "@/components/SignupForm";
import { SafeAreaView } from "react-native-safe-area-context";
import {router} from "expo-router";

export default function Signup() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"} style={{flex:1}}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start booking amazing restaurants</Text>
          </View>

          <SignupForm />

          <Text style={styles.bottomText}>Already have an account?{" "}
            <Text style={styles.linkText} onPress={() => router.push("/screens/Signin")}>Sign In.</Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 30,
    backgroundColor: "#fff",
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 6,
    marginBottom: 30,
  },

  bottomText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 50,
    fontSize: 14,
    color: "#666",
  },
  linkText: {
    color: "#FFA26B",
    fontWeight: "600",
  },
});
