import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { REVIEW_TAG_OPTIONS } from '../constants/reviewTags';
import { COLORS } from '../../../constants/colors';

type Props = {
  selected: string[];
  onToggle: (tag: string) => void;
  disabled?: boolean;
};

export default function ReviewTagSelector({
  selected,
  onToggle,
  disabled = false,
}: Props) {
  return (
    <View style={styles.wrap}>
      {REVIEW_TAG_OPTIONS.map((tag) => {
        const active = selected.includes(tag);

        return (
          <Pressable
            key={tag}
            disabled={disabled}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onToggle(tag)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {tag}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surfaceMuted,
  },
  chipActive: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successBg,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.success,
    fontWeight: '700',
  },
});
