import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getMonthMatrix } from '../utils/availabilityRules';
import { formatDateKey, isSameDate } from '../utils/time';
import { COLORS } from '../../../constants/colors';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type Props = {
  year: number;
  month: number;
  selectedDate: Date | null;
  today: Date;
  isDateSelectable: (date: Date) => boolean;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canGoPrevMonth: boolean;
};

export default function MonthCalendar({
  year,
  month,
  selectedDate,
  today,
  isDateSelectable,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  canGoPrevMonth,
}: Props) {
  const weeks = getMonthMatrix(year, month);

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        <Pressable
          onPress={onPrevMonth}
          disabled={!canGoPrevMonth}
          style={styles.monthNav}
        >
          <Text
            style={[
              styles.monthNavText,
              !canGoPrevMonth && styles.monthNavDisabled,
            ]}
          >
            ‹
          </Text>
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
              return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayCell} />;
            }

            const selectable = isDateSelectable(date);
            const selected =
              selectedDate !== null && isSameDate(date, selectedDate);
            const isToday = isSameDate(date, today);
            const dateKey = formatDateKey(date);

            return (
              <Pressable
                key={dateKey}
                style={[
                  styles.dayCell,
                  styles.dayButton,
                  selectable && styles.dayAvailable,
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
                    isToday && !selected && styles.dayTextToday,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthNav: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
  },
  monthNavDisabled: {
    color: COLORS.textPlaceholder,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 48,
    padding: 2,
  },
  dayButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayAvailable: {
    backgroundColor: COLORS.surfaceMuted,
  },
  daySelected: {
    backgroundColor: COLORS.primary,
  },
  dayDisabled: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  dayTextSelected: {
    color: COLORS.white,
  },
  dayTextDisabled: {
    color: COLORS.textPlaceholder,
    fontWeight: '500',
  },
  dayTextToday: {
    color: COLORS.primaryDark,
  },
});
