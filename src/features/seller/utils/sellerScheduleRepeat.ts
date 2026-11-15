import { formatDateKey, startOfDay } from '@/features/booking/utils/time';

import { SlotRepeatRule } from '../types/seller-schedule.types';

function matchesRepeatRule(date: Date, rule: SlotRepeatRule): boolean {
  const day = date.getDay();
  switch (rule) {
    case 'WEEKLY_SAT':
      return day === 6;
    case 'WEEKLY_SUN':
      return day === 0;
    case 'WEEKDAYS':
      return day >= 1 && day <= 5;
    default:
      return false;
  }
}

/** 선택일 포함 이후 4주간 반복 대상 날짜 */
export function expandRepeatDates(
  anchorDateKey: string,
  rule: SlotRepeatRule,
  today: Date
): string[] {
  if (rule === 'NONE') {
    return [anchorDateKey];
  }

  const anchor = new Date(anchorDateKey.replace(/-/g, '/'));
  const keys: string[] = [];
  const end = new Date(anchor);
  end.setDate(end.getDate() + 28);

  for (
    let cursor = new Date(anchor);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    if (cursor < startOfDay(today)) {
      continue;
    }
    if (matchesRepeatRule(cursor, rule)) {
      keys.push(formatDateKey(cursor));
    }
  }

  return keys.length > 0 ? keys : [anchorDateKey];
}
