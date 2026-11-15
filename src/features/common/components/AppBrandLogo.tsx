import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/constants/brand';
import { COLORS } from '@/constants/colors';

type Props = {
  size?: number;
};

/** COM-001 앱 로고 마크 */
export default function AppBrandLogo({ size = 88 }: Props) {
  return (
    <View
      style={[
        styles.logoBox,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: BRAND.logoBackground,
        },
      ]}
    >
      <Text style={[styles.logoGlyph, { fontSize: size * 0.42 }]}>🤝</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  logoGlyph: {
    textAlign: 'center',
  },
});
