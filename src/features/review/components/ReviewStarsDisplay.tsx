import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

type Props = {
  rating: number;
  size?: number;
};

export default function ReviewStarsDisplay({ rating, size = 18 }: Props) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Text
          key={value}
          style={[
            styles.star,
            { fontSize: size },
            value <= rating && styles.starFilled,
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    color: COLORS.borderDark,
  },
  starFilled: {
    color: COLORS.star,
  },
});
