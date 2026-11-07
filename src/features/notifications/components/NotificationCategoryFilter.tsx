import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { NotificationCategoryFilter } from '../types/notification.types';
import { COLORS } from '../../../constants/colors';

const OPTIONS: { key: NotificationCategoryFilter; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'BOOKING_PAYMENT', label: '예약/결제' },
  { key: 'MESSAGE', label: '메시지' },
  { key: 'SYSTEM', label: '시스템' },
];

type Props = {
  selected: NotificationCategoryFilter;
  onChange: (value: NotificationCategoryFilter) => void;
};

export default function NotificationCategoryFilterBar({
  selected,
  onChange,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {OPTIONS.map((option) => {
        const active = option.key === selected;

        return (
          <Pressable
            key={option.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(option.key)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.white,
  },
});
