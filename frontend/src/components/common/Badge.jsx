import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const BADGE_MAP = {
  // Trạng thái đặt bàn
  'đang chờ':         { bg: Colors.warningLight, color: Colors.warning },
  'đã xác nhận':      { bg: Colors.successLight, color: Colors.success },
  'đã check-in':      { bg: Colors.infoLight,    color: Colors.info },
  'hoàn thành':       { bg: Colors.successLight, color: Colors.success },
  'đã hủy':           { bg: Colors.errorLight,   color: Colors.error },
  // Trạng thái thanh toán
  'chưa thanh toán':  { bg: Colors.warningLight, color: Colors.warning },
  'đã thanh toán':    { bg: Colors.successLight, color: Colors.success },
  // Trạng thái bàn
  'Có sẵn':           { bg: Colors.successLight, color: Colors.success },
  'Đang sử dụng':     { bg: Colors.infoLight,    color: Colors.info },
  'Đã đặt':           { bg: Colors.warningLight, color: Colors.warning },
  'Bảo trì':          { bg: Colors.errorLight,   color: Colors.error },
};

/**
 * Nhãn trạng thái dùng chung
 * @param {string} label - Giá trị trạng thái
 */
export default function Badge({ label, style }) {
  const theme = BADGE_MAP[label] ?? {
    bg: Colors.surfaceSecondary,
    color: Colors.textSecondary,
  };

  return (
    <View style={[styles.badge, { backgroundColor: theme.bg }, style]}>
      <Text style={[styles.text, { color: theme.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
