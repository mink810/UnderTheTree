import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { OnboardingFlowStepId } from '../types/sellerOnboarding.types';

type StepDef = { id: string; label: string };

type Props = {
  steps: StepDef[];
  currentStepId: OnboardingFlowStepId;
};

function stepIndex(steps: StepDef[], id: string) {
  return steps.findIndex((s) => s.id === id);
}

export default function SellerOnboardingFlowStepper({
  steps,
  currentStepId,
}: Props) {
  const currentIndex = stepIndex(steps, currentStepId);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const upcoming = index > currentIndex;

          return (
            <React.Fragment key={step.id}>
              <View style={styles.stepCol}>
                <View
                  style={[
                    styles.circle,
                    done && styles.circleDone,
                    active && styles.circleActive,
                    upcoming && styles.circleUpcoming,
                  ]}
                >
                  <Text
                    style={[
                      styles.circleText,
                      (done || active) && styles.circleTextActive,
                      upcoming && styles.circleTextUpcoming,
                    ]}
                  >
                    {done ? '✓' : String(index + 1)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.label,
                    active && styles.labelActive,
                    done && styles.labelDone,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.connector,
                    index < currentIndex && styles.connectorDone,
                  ]}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  circleDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  circleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  circleUpcoming: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderDark,
  },
  circleText: {
    fontSize: 14,
    fontWeight: '800',
  },
  circleTextActive: {
    color: COLORS.white,
  },
  circleTextUpcoming: {
    color: COLORS.textSubtle,
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  labelDone: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  connector: {
    flex: 0.6,
    height: 2,
    backgroundColor: COLORS.borderDark,
    marginTop: 15,
    marginHorizontal: -4,
  },
  connectorDone: {
    backgroundColor: COLORS.primary,
  },
});
