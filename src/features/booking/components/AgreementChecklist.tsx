import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

export type AgreementKey =
  | 'usageGuide'
  | 'refundPolicy'
  | 'termsAndPayment';

const ITEMS: { key: AgreementKey; label: string }[] = [
  { key: 'usageGuide', label: '예약 및 이용 안내 확인' },
  { key: 'refundPolicy', label: '취소·환불 정책 확인' },
  { key: 'termsAndPayment', label: '서비스 이용약관 및 결제 관련 안내 확인' },
];

type Props = {
  checked: Record<AgreementKey, boolean>;
  onToggle: (key: AgreementKey) => void;
};

export default function AgreementChecklist({ checked, onToggle }: Props) {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const isChecked = checked[item.key];

        return (
          <Pressable
            key={item.key}
            style={styles.row}
            onPress={() => onToggle(item.key)}
          >
            <View style={[styles.box, isChecked && styles.boxChecked]}>
              {isChecked ? <Text style={styles.check}>✓</Text> : null}
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function allAgreementsChecked(
  checked: Record<AgreementKey, boolean>
): boolean {
  return ITEMS.every((item) => checked[item.key]);
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  boxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  check: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
