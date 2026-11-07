import { BookingSelection } from '../types/availability.types';
import { BookingConfirmation } from '../types/booking-confirmation.types';

export function buildBookingConfirmation(
  selection: BookingSelection,
  additionalFee = 0,
  discountAmount = 0
): BookingConfirmation {
  const productPrice = selection.price;

  return {
    sellerId: selection.sellerId,
    productId: selection.productId,
    date: selection.date,
    startTime: selection.startTime,
    endTime: selection.endTime,
    durationMinutes: selection.durationMinutes,
    productPrice,
    additionalFee,
    discountAmount,
    totalAmount: productPrice + additionalFee - discountAmount,
  };
}

export function confirmationToRouteParams(
  confirmation: BookingConfirmation
): Record<string, string> {
  return {
    sellerId: confirmation.sellerId,
    productId: confirmation.productId,
    date: confirmation.date,
    startTime: confirmation.startTime,
    endTime: confirmation.endTime,
    durationMinutes: String(confirmation.durationMinutes),
    price: String(confirmation.productPrice),
    additionalFee: String(confirmation.additionalFee),
    discountAmount: String(confirmation.discountAmount),
    totalAmount: String(confirmation.totalAmount),
  };
}

export function routeParamsToSelection(params: {
  sellerId?: string;
  productId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: string;
  price?: string;
}): BookingSelection | null {
  if (
    !params.sellerId ||
    !params.productId ||
    !params.date ||
    !params.startTime ||
    !params.endTime
  ) {
    return null;
  }

  return {
    sellerId: params.sellerId,
    productId: params.productId,
    date: params.date,
    startTime: params.startTime,
    endTime: params.endTime,
    durationMinutes: Number(params.durationMinutes ?? 0),
    price: Number(params.price ?? 0),
  };
}
