import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import MainImage from "@/components/ui/MainImage";
import RestaurantInfo from "@/components/ui/RestaurantInfo";

export default function Main() {
  return (
    <View style={styles.container}>
      <MainImage />

      <RestaurantInfo />

      <PrimaryButton
        title="Get Started"
        onPress={() => router.push("/screens/Signin")}
        style={styles.startButton}
        textStyle={styles.startButtonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    padding: 13,
  },
  startButton: {
    backgroundColor: "#ff9e6b",
    padding: 10,
    marginTop: 60,
    borderRadius: 15,
  },
  startButtonText: {
    fontSize: 20,
    textAlign: "center",
  },
});
