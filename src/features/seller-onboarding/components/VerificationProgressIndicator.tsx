import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { VerificationProgressStep } from '../types/sellerOnboarding.types';

function StepIcon({
  icon,
  active,
}: {
  icon: VerificationProgressStep['icon'];
  active: boolean;
}) {
  const glyph =
    icon === 'phone' ? '📱' : icon === 'confirm' ? '✓' : '👤';

  return (
    <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
      <Text style={[styles.iconText, active && styles.iconTextActive]}>
        {glyph}
      </Text>
    </View>
  );
}

type Props = {
  steps: VerificationProgressStep[];
  activeStepId: string;
};

export default function VerificationProgressIndicator({
  steps,
  activeStepId,
}: Props) {
  return (
    <View style={styles.row}>
      {steps.map((step, index) => {
        const active = step.id === activeStepId;
        return (
          <React.Fragment key={step.id}>
            <View style={styles.step}>
              <StepIcon icon={step.icon} active={active} />
              <Text style={[styles.label, active && styles.labelActive]}>
                {step.label}
              </Text>
            </View>
            {index < steps.length - 1 ? (
              <Text style={styles.arrow}>›</Text>
            ) : null}
          </React.Fragment>
        );
      })}
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  iconText: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  iconTextActive: {
    color: COLORS.primary,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 18,
    color: COLORS.textSubtle,
    marginTop: 14,
    paddingHorizontal: 2,
  },
});
