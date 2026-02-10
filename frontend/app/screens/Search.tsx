import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import SearchBox from "@/components/ui/SearchBox";

export default function Search() {
  const data = ["Classic", "Modern", "Private"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Type of Tables</Text>
      </View>

      {/* Search */}
      <SearchBox placeholder="Search" iconType="fontawesome" style={{ marginTop: 10, marginBottom: 25 }} />

      {/* List */}
      {data.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <View style={styles.imagePlaceholder} />
          <Text style={styles.cardText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 15,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25,
    marginTop: 10,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  imagePlaceholder: {
    width: 85,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#FF8F8F",
    marginRight: 15,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
