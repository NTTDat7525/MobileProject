import { View, StyleSheet, StatusBar } from "react-native";
import AuthHeader from "@/components/ui/AuthHeader";
import SigninForm from "@/components/ui/SigninForm";
import AuthFooter from "@/components/ui/AuthFooter";

export default function Signin() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <AuthHeader
  title="Welcome Back"
  subtitle="Sign in to continue booking"
/>
      <SigninForm />
      <AuthFooter
  text="Don't have an account?"
  linkText="Sign Up."
  linkTo="/screens/Signup"
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    flex: 1,
  },
});
