import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { VerificationRequirementItem } from '../types/sellerOnboarding.types';

function RequirementIcon({ icon }: { icon: VerificationRequirementItem['icon'] }) {
  if (icon === 'adult') {
    return (
      <View style={styles.adultBadge}>
        <Text style={styles.adultText}>19+</Text>
      </View>
    );
  }

  return (
    <View style={styles.iconCircle}>
      <Text style={styles.iconGlyph}>📱</Text>
    </View>
  );
}

type Props = {
  items: VerificationRequirementItem[];
};

export default function VerificationStatusCard({ items }: Props) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.row}>
            <RequirementIcon icon={item.icon} />
            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: 20,
  },
  adultBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adultText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primary,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textMuted,
  },
});
