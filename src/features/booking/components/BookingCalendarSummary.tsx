import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

type Props = {
  selectedDateTimeLabel: string | null;
  durationMinutes: number;
  price: number;
  canConfirm: boolean;
  bottomInset: number;
  onConfirm: () => void;
};

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

export default function BookingCalendarSummary({
  selectedDateTimeLabel,
  durationMinutes,
  price,
  canConfirm,
  bottomInset,
  onConfirm,
}: Props) {
  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, 12) }]}>
      <SummaryRow
        label="선택한 시간"
        value={selectedDateTimeLabel ?? '-'}
      />
      <SummaryRow
        label="이용 시간"
        value={`${durationMinutes}분`}
      />
      <SummaryRow
        label="상품 금액"
        value={`${price.toLocaleString('ko-KR')}원`}
        bold
      />

      <Pressable
        style={[styles.confirmButton, !canConfirm && styles.confirmButtonDisabled]}
        disabled={!canConfirm}
        onPress={onConfirm}
      >
        <Text
          style={[
            styles.confirmButtonText,
            !canConfirm && styles.confirmButtonTextDisabled,
          ]}
        >
          예약 정보 확인
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  rowValueBold: {
    fontSize: 16,
    fontWeight: '900',
  },
  confirmButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.surfaceGray,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  confirmButtonTextDisabled: {
    color: COLORS.textPlaceholder,
  },
});
