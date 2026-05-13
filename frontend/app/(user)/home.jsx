import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';

const banners = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
];

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Image source={{ uri: banners[index] }} style={styles.banner} />

          <View style={styles.overlay}>
            <Text style={styles.brand}>Golden Spoons</Text>
            <Text style={styles.heroText}>Không gian ẩm thực hiện đại cho mọi cuộc hẹn.</Text>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.kicker}>Nhà hàng đặt bàn online</Text>
          <Text style={styles.title}>Chọn bàn đẹp, đến đúng giờ, thưởng thức trọn vị</Text>
          <Text style={styles.text}>
            Golden Spoons là nhà hàng ẩm thực cao cấp mang phong cách hiện đại
            kết hợp tinh hoa ẩm thực Á – Âu. Chúng tôi mang đến trải nghiệm sang
            trọng, tinh tế và đầy cảm xúc trong từng món ăn.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Điểm nổi bật</Text>

          <Feature icon="restaurant-outline" text="Thực đơn đa dạng Á – Âu" />
          <Feature icon="wine-outline" text="Rượu vang nhập khẩu cao cấp" />
          <Feature icon="leaf-outline" text="Nguyên liệu tươi mỗi ngày" />
          <Feature icon="star-outline" text="Dịch vụ chuẩn 5 sao" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin nhà hàng</Text>

          <Info icon="time-outline" text="Giờ mở cửa: 10:00 - 22:00" />
          <Info icon="location-outline" text="235 Hoàng Quốc Việt, Nghĩa Đô, Hà Nội" />
          <Info icon="call-outline" text="Hotline: 0123 456 789" />
          <Info icon="mail-outline" text="support@goldenspoon.vn" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function Info({ icon, text }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

function Feature({ icon, text }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={Colors.success} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  banner: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xxl,
    backgroundColor: 'rgba(17,24,39,0.35)',
  },
  heroText: {
    maxWidth: 280,
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    lineHeight: 20,
    color: Colors.white,
  },
  kicker: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },

  brand: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.heavy,
    color: '#fff',
  },

  section: {
    padding: Spacing.lg,
  },

  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  text: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },

  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    color: Colors.text,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 28,
  },

  rowText: {
    marginLeft: 8,
    fontSize: FontSize.sm,
    color: Colors.text,
    flex: 1,
  },

});
