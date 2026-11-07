import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

type Props = {
  rating: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  label?: string;
};

export default function StarRatingInput({
  rating,
  onChange,
  disabled = false,
  label,
}: Props) {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = value <= rating;

          return (
            <Pressable
              key={value}
              disabled={disabled}
              onPress={() => onChange(value)}
              hitSlop={6}
            >
              <Text style={[styles.star, filled && styles.starFilled]}>★</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 36,
    color: COLORS.borderDark,
  },
  starFilled: {
    color: COLORS.star,
  },
});
