import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TimeSlotOption } from '../types/availability.types';
import { COLORS } from '../../../constants/colors';

type Props = {
  dateLabel: string;
  options: TimeSlotOption[];
  onSelectTime: (startTime: string) => void;
};

function statusLabel(status: TimeSlotOption['displayStatus']): string | null {
  switch (status) {
    case 'BOOKED':
      return '예약 완료';
    case 'BLOCKED':
      return '휴무';
    case 'UNAVAILABLE':
      return '예약 불가';
    default:
      return null;
  }
}

export default function TimeSlotGrid({
  dateLabel,
  options,
  onSelectTime,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.dateTitle}>{dateLabel}</Text>
      <Text style={styles.subtitle}>예약 가능한 시간을 선택해주세요</Text>

      <View style={styles.grid}>
        {options.map((option) => {
          const disabled = option.displayStatus !== 'AVAILABLE' &&
            option.displayStatus !== 'SELECTED';
          const label = statusLabel(option.displayStatus);
          const selected = option.displayStatus === 'SELECTED';

          return (
            <Pressable
              key={option.startTime}
              style={[
                styles.slot,
                selected && styles.slotSelected,
                disabled && styles.slotDisabled,
              ]}
              disabled={disabled}
              onPress={() => onSelectTime(option.startTime)}
            >
              <Text
                style={[
                  styles.slotTime,
                  selected && styles.slotTimeSelected,
                  disabled && styles.slotTimeDisabled,
                ]}
              >
                {option.startTime}
              </Text>
              {label ? (
                <Text
                  style={[
                    styles.slotStatus,
                    option.displayStatus === 'BOOKED' && styles.slotBooked,
                  ]}
                >
                  {label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  slot: {
    width: '30%',
    minWidth: 96,
    flexGrow: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
  },
  slotSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLighter,
  },
  slotDisabled: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
  },
  slotTime: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  slotTimeSelected: {
    color: COLORS.primaryDark,
  },
  slotTimeDisabled: {
    color: COLORS.textPlaceholder,
    fontWeight: '600',
  },
  slotStatus: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  slotBooked: {
    color: '#C53E3E',
  },
});
