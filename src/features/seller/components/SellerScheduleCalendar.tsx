import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { getMonthMatrix } from '@/features/booking/utils/availabilityRules';
import {
  formatDateKey,
  isSameDate,
} from '@/features/booking/utils/time';

import { DayMarkerKind } from '../types/seller-schedule.types';
import { isBeforeToday } from '../utils/sellerScheduleTime';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type Props = {
  year: number;
  month: number;
  selectedDate: Date | null;
  today: Date;
  getMarker: (dateKey: string) => DayMarkerKind;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function SellerScheduleCalendar({
  year,
  month,
  selectedDate,
  today,
  getMarker,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const weeks = getMonthMatrix(year, month);

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        <Pressable onPress={onPrevMonth} style={styles.monthNav}>
          <Text style={styles.monthNavText}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>
          {year}년 {month + 1}월
        </Text>
        <Pressable onPress={onNextMonth} style={styles.monthNav}>
          <Text style={styles.monthNavText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((label) => (
          <Text key={label} style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={`week-${weekIndex}`} style={styles.weekRow}>
          {week.map((date, dayIndex) => {
            if (!date) {
              return (
                <View
                  key={`empty-${weekIndex}-${dayIndex}`}
                  style={styles.dayCell}
                />
              );
            }

            const dateKey = formatDateKey(date);
            const selected =
              selectedDate !== null && isSameDate(date, selectedDate);
            const isToday = isSameDate(date, today);
            const marker = getMarker(dateKey);
            const selectable = !isBeforeToday(date, today);

            return (
              <Pressable
                key={dateKey}
                style={[
                  styles.dayButton,
                  selectable && styles.daySelectable,
                  selected && styles.daySelected,
                  !selectable && styles.dayDisabled,
                ]}
                disabled={!selectable}
                onPress={() => onSelectDate(date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.dayTextSelected,
                    !selectable && styles.dayTextDisabled,
                    isToday && !selected && selectable && styles.dayTextToday,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <View style={styles.dotRow}>
                  {selectable && marker === 'open' ? (
                    <View style={[styles.dot, styles.dotOpen]} />
                  ) : null}
                  {selectable && marker === 'mixed' ? (
                    <View style={[styles.dot, styles.dotMixed]} />
                  ) : null}
                  {selectable && marker === 'none' ? (
                    <View style={styles.dotPlaceholder} />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      <View style={styles.legend}>
        <LegendDot color={COLORS.success} label="예약 가능" />
        <LegendDot color="#E6A04D" label="예약 일부 완료" />
        <LegendDot color={COLORS.border} label="일정 없음" hollow />
      </View>
    </View>
  );
}

function LegendDot({
  color,
  label,
  hollow,
}: {
  color: string;
  label: string;
  hollow?: boolean;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          hollow ? styles.legendDotHollow : { backgroundColor: color },
        ]}
      />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthNav: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: { fontSize: 26, color: COLORS.text, fontWeight: '600' },
  monthLabel: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  weekdayRow: { flexDirection: 'row', marginBottom: 6 },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  dayCell: { flex: 1, aspectRatio: 1, maxHeight: 48 },
  dayButton: {
    flex: 1,
    margin: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    maxHeight: 48,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  daySelectable: {
    backgroundColor: COLORS.surface,
  },
  daySelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  dayDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dayText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  dayTextSelected: { color: COLORS.primaryDark },
  dayTextDisabled: {
    color: COLORS.textPlaceholder,
    fontWeight: '500',
  },
  dayTextToday: { color: COLORS.primary },
  dotRow: { height: 8, marginTop: 2, justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotOpen: { backgroundColor: COLORS.success },
  dotMixed: { backgroundColor: '#E6A04D' },
  dotPlaceholder: { width: 6, height: 6, borderRadius: 3 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendDotHollow: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  legendLabel: { fontSize: 11, color: COLORS.textMuted },
});
