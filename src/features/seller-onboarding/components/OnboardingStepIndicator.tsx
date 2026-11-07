import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { SellerOnboardingStep } from '../types/sellerOnboarding.types';

function StepIcon({ icon }: { icon: SellerOnboardingStep['icon'] }) {
  const glyph =
    icon === 'info'
      ? '✎'
      : icon === 'verify'
        ? '✓'
        : icon === 'apply'
          ? '▤'
          : icon === 'extra'
            ? '▶'
            : '◎';

  return (
    <View style={styles.iconCircle}>
      <Text style={styles.iconText}>{glyph}</Text>
    </View>
  );
}

type Props = {
  steps: SellerOnboardingStep[];
};

export default function OnboardingStepIndicator({ steps }: Props) {
  return (
    <View style={styles.row}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <View style={styles.step}>
            <StepIcon icon={step.icon} />
            <Text style={styles.label}>{step.label}</Text>
          </View>
          {index < steps.length - 1 ? (
            <Text style={styles.arrow}>›</Text>
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 10,
    paddingHorizontal: 2,
  },
});
