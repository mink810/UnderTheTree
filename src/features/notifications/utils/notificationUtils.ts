import {
  AppNotification,
  NotificationCategoryFilter,
  NotificationType,
} from '../types/notification.types';
import { formatKoreanDateOnly } from '../../booking/utils/time';

export function getNotificationCategory(
  type: NotificationType
): NotificationCategoryFilter {
  if (type === 'MESSAGE') {
    return 'MESSAGE';
  }
  if (type === 'SYSTEM') {
    return 'SYSTEM';
  }
  return 'BOOKING_PAYMENT';
}

export function filterNotificationsByCategory(
  items: AppNotification[],
  category: NotificationCategoryFilter
): AppNotification[] {
  if (category === 'ALL') {
    return items;
  }

  return items.filter(
    (item) => getNotificationCategory(item.type) === category
  );
}

export type NotificationDateGroupKey = 'TODAY' | 'YESTERDAY' | 'EARLIER';

export function getDateGroupKey(iso: string): NotificationDateGroupKey {
  const date = new Date(iso);
  const today = startOfLocalDay(new Date());
  const target = startOfLocalDay(date);
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return 'TODAY';
  }
  if (diffDays === 1) {
    return 'YESTERDAY';
  }
  return 'EARLIER';
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const DATE_GROUP_LABELS: Record<NotificationDateGroupKey, string> = {
  TODAY: '오늘',
  YESTERDAY: '어제',
  EARLIER: '이전',
};

export function groupNotificationsByDate(
  items: AppNotification[]
): { key: NotificationDateGroupKey; label: string; data: AppNotification[] }[] {
  const sorted = [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const groups: Record<NotificationDateGroupKey, AppNotification[]> = {
    TODAY: [],
    YESTERDAY: [],
    EARLIER: [],
  };

  for (const item of sorted) {
    groups[getDateGroupKey(item.createdAt)].push(item);
  }

  return (['TODAY', 'YESTERDAY', 'EARLIER'] as const)
    .filter((key) => groups[key].length > 0)
    .map((key) => ({
      key,
      label: DATE_GROUP_LABELS[key],
      data: groups[key],
    }));
}

export function formatNotificationListTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));

  if (diffMin < 1) {
    return '방금';
  }
  if (diffMin < 60) {
    return `${diffMin}분 전`;
  }

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24 && getDateGroupKey(iso) === 'TODAY') {
    return `${diffHour}시간 전`;
  }

  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatNotificationDetailTime(iso: string): string {
  const date = new Date(iso);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${y}.${mo}.${d} ${h}:${mi}`;
}

export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'BOOKING':
      return '📅';
    case 'PAYMENT':
      return '💳';
    case 'MESSAGE':
      return '💬';
    case 'REVIEW':
      return '★';
    default:
      return '📢';
  }
}

export function getTargetActionLabel(
  targetType: AppNotification['targetType']
): string | null {
  switch (targetType) {
    case 'BOOKING_DETAIL':
      return '예약 상세 보기';
    case 'CHAT_ROOM':
      return '대화방으로 이동';
    case 'REVIEW_WRITE':
      return '후기 작성하기';
    default:
      return null;
  }
}

export function formatBookingDateLabel(dateKey?: string): string {
  if (!dateKey) {
    return '-';
  }
  return formatKoreanDateOnly(dateKey);
}
