import { Booking, BookingStatus, ReservationTabKey } from '../types/booking.types';
import { addDays, parseDateKey, startOfDay } from './time';

export const TAB_OPTIONS: { key: ReservationTabKey; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'UPCOMING', label: '예약 예정' },
  { key: 'COMPLETED', label: '이용 완료' },
  { key: 'CANCELLED', label: '취소·환불' },
];

const CANCEL_TAB_STATUSES: BookingStatus[] = [
  'CANCEL_REQUESTED',
  'CANCELLED',
  'REFUND_PENDING',
  'REFUNDED',
  'DISPUTED',
];

export function filterBookingsByTab(
  bookings: Booking[],
  tab: ReservationTabKey
): Booking[] {
  switch (tab) {
    case 'UPCOMING':
      return bookings.filter((b) => b.status === 'CONFIRMED');
    case 'COMPLETED':
      return bookings.filter((b) => b.status === 'COMPLETED');
    case 'CANCELLED':
      return bookings.filter((b) => CANCEL_TAB_STATUSES.includes(b.status));
    default:
      return bookings;
  }
}

export function getStatusSectionLabel(status: BookingStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return '예약 예정';
    case 'COMPLETED':
      return '이용 완료';
    case 'CANCEL_REQUESTED':
      return '취소 처리 중';
    case 'CANCELLED':
      return '취소 완료';
    case 'REFUND_PENDING':
      return '환불 진행 중';
    case 'REFUNDED':
      return '환불 완료';
    case 'DISPUTED':
      return '확인 중';
    default:
      return '예약';
  }
}

export function getStatusBadgeLabel(booking: Booking): string {
  switch (booking.status) {
    case 'CONFIRMED':
      return '예약 확정';
    case 'COMPLETED':
      return booking.reviewWritten ? '후기 작성 완료' : '후기 작성 가능';
    case 'CANCEL_REQUESTED':
      return '취소 처리 중';
    case 'CANCELLED':
      return '취소 완료';
    case 'REFUND_PENDING':
      return '환불 진행 중';
    case 'REFUNDED':
      return '환불 완료';
    case 'DISPUTED':
      return '분쟁 확인 중';
    default:
      return '';
  }
}

export function getBadgeTone(
  status: BookingStatus
): 'success' | 'neutral' | 'warning' | 'muted' {
  if (status === 'CONFIRMED') {
    return 'success';
  }
  if (status === 'COMPLETED') {
    return 'neutral';
  }
  if (status === 'CANCEL_REQUESTED' || status === 'REFUND_PENDING') {
    return 'warning';
  }
  return 'muted';
}

/** 예약일 다음날 00:00부터 대화 제한 (서버 정책 연동 지점) */
export function canAccessBookingChat(
  booking: Booking,
  now: Date = new Date()
): boolean {
  if (booking.status !== 'CONFIRMED') {
    return false;
  }

  const chatCutoff = addDays(parseDateKey(booking.date), 1);
  chatCutoff.setHours(0, 0, 0, 0);

  return now < chatCutoff;
}

export function canRequestCancel(
  booking: Booking,
  now: Date = new Date()
): boolean {
  if (booking.status !== 'CONFIRMED') {
    return false;
  }

  const reservationDay = startOfDay(parseDateKey(booking.date));
  return now < reservationDay;
}

export function formatBookingScheduleShort(booking: Booking): string {
  const date = parseDateKey(booking.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일 ${booking.startTime}`;
}

export function bookingToDetailParams(
  booking: Booking
): Record<string, string> {
  return {
    bookingId: booking.id,
    reservationNumber: booking.reservationNumber,
    sellerId: booking.sellerId,
    productId: booking.productId,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    totalAmount: String(booking.totalAmount),
    status: booking.status,
    reviewWritten: booking.reviewWritten ? '1' : '0',
    paymentStatus: 'PAID',
    bookingStatus: booking.status === 'CONFIRMED' ? 'CONFIRMED' : 'CONFIRMED',
    paymentId: `pay_${booking.id}`,
  };
}
