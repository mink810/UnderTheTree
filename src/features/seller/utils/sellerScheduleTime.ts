import {
  formatDateKey,
  parseTimeToMinutes,
  startOfDay,
} from '@/features/booking/utils/time';

export function isPastDateKey(dateKey: string, today: Date): boolean {
  const d = startOfDay(new Date(dateKey.replace(/-/g, '/')));
  return d < startOfDay(today);
}

/** 달력에서 오늘 이전 날짜 선택 불가 */
export function isBeforeToday(date: Date, today: Date): boolean {
  return startOfDay(date) < startOfDay(today);
}

/** 해당 슬롯 종료 시각이 현재 시각 이전이면 조작 불가 (당일·과거일) */
export function isSlotEndBeforeNow(
  dateKey: string,
  endTime: string,
  now: Date
): boolean {
  if (isPastDateKey(dateKey, now)) {
    return true;
  }
  if (formatDateKey(now) !== dateKey) {
    return false;
  }
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return parseTimeToMinutes(endTime) <= nowMinutes;
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    return false;
  }
  return parseTimeToMinutes(endTime) > parseTimeToMinutes(startTime);
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  const a0 = parseTimeToMinutes(aStart);
  const a1 = parseTimeToMinutes(aEnd);
  const b0 = parseTimeToMinutes(bStart);
  const b1 = parseTimeToMinutes(bEnd);
  return a0 < b1 && b0 < a1;
}

export function formatKoreanWeekday(dateKey: string): string {
  const d = new Date(dateKey.replace(/-/g, '/'));
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  return labels[d.getDay()];
}
