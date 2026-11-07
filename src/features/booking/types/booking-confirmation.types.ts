export interface BookingConfirmation {
  sellerId: string;
  productId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  productPrice: number;
  additionalFee: number;
  discountAmount: number;
  totalAmount: number;
}
