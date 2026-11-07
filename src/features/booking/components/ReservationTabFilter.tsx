import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ReservationTabKey } from '../types/booking.types';
import { TAB_OPTIONS } from '../utils/bookingStatus';
import { COLORS } from '../../../constants/colors';

type Props = {
  activeTab: ReservationTabKey;
  onChange: (tab: ReservationTabKey) => void;
};

export default function ReservationTabFilter({ activeTab, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TAB_OPTIONS.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(tab.key)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {tab.label}
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
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.success,
  },
});
