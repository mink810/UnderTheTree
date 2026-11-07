export type PaymentMethod = 'CARD' | 'EASY_PAY';

export type PaymentLifecycleStatus =
  | 'READY'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

export type PaymentResultStatus = 'PAID' | 'FAILED' | 'CANCELLED';

export interface PaymentResult {
  paymentId: string;
  bookingId: string;
  status: PaymentResultStatus;
  amount: number;
  paidAt?: string;
}
