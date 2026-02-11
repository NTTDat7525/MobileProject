import { View, StyleSheet, Text } from "react-native";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function SigninForm() {
  return (
    <View>
      <InputField
        label="Username"
        placeholder="Enter your username"
        iconName="user"
      />

      <InputField
        label="Password"
        placeholder="Enter your password"
        iconName="lock"
        secureTextEntry
      />

      <PrimaryButton
        title="Continue"
        onPress={() => {}}
        style={styles.continueButton}
      />

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
  orText: {
    textAlign: "center",
    color: "#bbb",
    marginVertical: 20,
    fontSize: 13,
  },
});
