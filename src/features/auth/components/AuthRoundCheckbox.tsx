import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  checked: boolean;
  onPress: () => void;
  label: string;
  trailing?: React.ReactNode;
};

export default function AuthRoundCheckbox({
  checked,
  onPress,
  label,
  trailing,
}: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.circle, checked && styles.circleOn]}>
        {checked ? <View style={styles.innerDot} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  circleOn: {
    borderColor: COLORS.primary,
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  trailing: {
    marginLeft: 'auto',
  },
});
