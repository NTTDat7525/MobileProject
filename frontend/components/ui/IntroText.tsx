import { View, Text, StyleSheet } from "react-native";

export default function IntroText() {
  return (
    <View>
      <Text style={styles.text}>An elegant European-style restaurant</Text>
      <Text style={styles.text}>with vintage décor, fine wines,</Text>
      <Text style={styles.text}>and authentic French–Italian cuisine.</Text>
      <Text style={styles.text}>Perfect for romantic dinners</Text>
      <Text style={styles.text}>or refined gatherings in a timeless setting.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
});
