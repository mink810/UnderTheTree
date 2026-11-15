import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { MBTI_TYPES } from '../constants/profileEdit';

type Props = {
  value: string | null;
  onChange: (mbti: string | null) => void;
};

export default function SellerProfileMbtiGrid({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>MBTI 선택</Text>
        <View style={styles.optionalChip}>
          <Text style={styles.optionalText}>선택형</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {MBTI_TYPES.map((type) => {
          const selected = value === type;
          return (
            <Pressable
              key={type}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onChange(selected ? null : type)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {type}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 28 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  optionalChip: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  optionalText: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    width: '22%',
    minWidth: 72,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  chipText: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  chipTextSelected: { color: COLORS.primary },
});
