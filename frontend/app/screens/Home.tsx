import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Classic");

  const categories = ["Classic", "Modern", "Party"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.title}>CATEGORIES</Text>

      <View style={styles.categoryRow}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryBtn,
              activeCategory === item && styles.categoryActive,
            ]}
            onPress={() => setActiveCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
          }}
          style={styles.cardImage}
        />

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Fine dinning</Text>
          <Text style={styles.cardDesc}>
            Fine dining tables at The Grand Cellar are elegantly set with white
            linens, crystal glassware, and candlelight.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 70,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  categoryRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#f4f4f4",
    marginRight: 10,
  },

  categoryActive: {
    backgroundColor: "#FFA366",
  },

  categoryText: {
    color: "#555",
    fontWeight: "500",
  },

  categoryTextActive: {
    color: "#fff",
  },

  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },

  cardImage: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    backgroundColor: "#F8EED6",
    padding: 15,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },

  cardDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
});
