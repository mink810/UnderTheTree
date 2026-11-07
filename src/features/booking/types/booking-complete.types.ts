export interface BookingComplete {
  bookingId: string;
  reservationNumber: string;
  sellerId: string;
  productId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  paymentStatus: 'PAID';
  bookingStatus: 'CONFIRMED';
  paymentId: string;
}
