import { ScrollView, StyleSheet, StatusBar } from "react-native";
import AuthHeader from "@/components/ui/AuthHeader";
import SignupForm from "@/components/ui/SignupForm";
import AuthFooter from "@/components/ui/AuthFooter";

export default function Signup() {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      <AuthHeader
        title="Create Account"
        subtitle="Sign up to start booking amazing restaurants"
      />

      <SignupForm />

      <AuthFooter
        text="Already have an account?"
        linkText="Sign In."
        linkTo="/screens/Signin"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
});
