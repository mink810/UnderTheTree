export function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

export function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function minutesToTime(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(parseTimeToMinutes(time) + minutes);
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const WEEKDAY_LABELS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

const WEEKDAY_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

export function formatKoreanDateLabel(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${month}월 ${day}일 ${weekday}`;
}

export function formatKoreanDateTimeSummary(
  dateKey: string,
  startTime: string
): string {
  const date = parseDateKey(dateKey);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일 ${startTime}`;
}

export function formatKoreanDateFull(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAY_SHORT[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function formatKoreanDateOnly(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}
