export type BookingStatus =
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCEL_REQUESTED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED';

export interface Booking {
  id: string;
  reservationNumber: string;
  sellerId: string;
  sellerNickname: string;
  sellerAge: number;
  productId: string;
  productName: string;
  productImage: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: BookingStatus;
  reviewWritten: boolean;
}

export type ReservationTabKey = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
