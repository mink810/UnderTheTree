import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  title?: string;
  items: string[];
};

export default function OnboardingNotice({
  title = '꼭 확인해주세요!',
  items,
}: Props) {
  return (
    <View style={styles.box}>
      <View style={styles.titleRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>!</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.item}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 4,
  },
  bullet: {
    color: COLORS.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  item: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
});
