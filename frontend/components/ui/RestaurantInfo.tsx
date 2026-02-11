import { View, Text, StyleSheet } from "react-native";
import IntroText from "./IntroText";

export default function RestaurantInfo() {
  return (
    <View style={styles.body}>
      <Text style={styles.resName}>The Grand Cellar</Text>
      <IntroText />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 30,
  },
  resName: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
});
