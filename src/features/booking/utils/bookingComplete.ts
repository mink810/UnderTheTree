import { BookingComplete } from '../types/booking-complete.types';

export function createReservationNumber(
  dateKey: string,
  bookingId: string
): string {
  const compactDate = dateKey.replace(/-/g, '');
  const suffix = bookingId.slice(-3).padStart(3, '0');
  return `BK-${compactDate}-${suffix}`;
}

export function parseBookingCompleteParams(
  params: Record<string, string | undefined>
): BookingComplete | null {
  if (
    !params.bookingId ||
    !params.paymentId ||
    !params.sellerId ||
    !params.productId ||
    !params.date ||
    !params.startTime ||
    !params.endTime
  ) {
    return null;
  }

  const bookingId = params.bookingId;
  const reservationNumber =
    params.reservationNumber ??
    createReservationNumber(params.date, bookingId);

  return {
    bookingId,
    reservationNumber,
    sellerId: params.sellerId,
    productId: params.productId,
    date: params.date,
    startTime: params.startTime,
    endTime: params.endTime,
    totalAmount: Number(params.totalAmount ?? 0),
    paymentStatus: 'PAID',
    bookingStatus: 'CONFIRMED',
    paymentId: params.paymentId,
  };
}

export function bookingCompleteToRouteParams(
  data: BookingComplete
): Record<string, string> {
  return {
    bookingId: data.bookingId,
    reservationNumber: data.reservationNumber,
    sellerId: data.sellerId,
    productId: data.productId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    totalAmount: String(data.totalAmount),
    paymentStatus: data.paymentStatus,
    bookingStatus: data.bookingStatus,
    paymentId: data.paymentId,
  };
}
