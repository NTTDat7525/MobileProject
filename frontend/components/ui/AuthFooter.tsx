import { Text, StyleSheet } from "react-native";
import { router } from "expo-router";

interface Props {
  text: string;
  linkText: string;
  linkTo: string;
}

export default function AuthFooter({ text, linkText, linkTo }: Props) {
  return (
    <Text style={styles.bottomText}>
      {text}{" "}
      <Text
        style={styles.linkText}
        onPress={() => router.push(linkTo as any)}
      >
        {linkText}
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  bottomText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
    color: "#666",
  },
  linkText: {
    color: "#FFA26B",
    fontWeight: "600",
  },
});
