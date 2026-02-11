import { View, StyleSheet } from "react-native";

export default function MainImage() {
  return <View style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#ff8787",
    height: 244,
    width: "100%",
    marginTop: 50,
    borderRadius: 15,
  },
});
