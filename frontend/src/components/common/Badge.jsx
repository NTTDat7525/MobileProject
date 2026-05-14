import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const BADGE_MAP = {
  // trạng thái đặt bàn
  'Đang chờ':         { bg: Colors.warningLight, color: Colors.warning },
  'Đã xác nhận':      { bg: Colors.successLight, color: Colors.success },
  'Đã check-in':      { bg: Colors.infoLight,    color: Colors.info },
  'Hoàn thành':       { bg: Colors.successLight, color: Colors.success },
  'Đã hủy':           { bg: Colors.errorLight,   color: Colors.error },
  // trạng thái thanh toán
  'Chưa thanh toán':  { bg: Colors.warningLight, color: Colors.warning },
  'Đã thanh toán':    { bg: Colors.successLight, color: Colors.success },
  // trạng thái bàn
  'Có sẵn':           { bg: Colors.successLight, color: Colors.success },
  'Đang sử dụng':     { bg: Colors.infoLight,    color: Colors.info },
  'Đã đặt':           { bg: Colors.warningLight, color: Colors.warning },
  'Bảo trì':          { bg: Colors.errorLight,   color: Colors.error },
};

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
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(17,24,39,0.04)',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
