import {
  PaymentRequest,
  PaymentResult,
} from '../types/payment.types';

const MOCK_FAIL_RATE = 0.2;

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const mockPaymentService = {
  /**
   * Mock 결제 — 실제 금액 이동 없음.
   * retryAttempt > 0 이면 항상 성공 (재시도 UX 검증용).
   */
  async processPayment(
    request: PaymentRequest,
    retryAttempt = 0
  ): Promise<PaymentResult> {
    await delay(1400);

    const shouldFail =
      retryAttempt === 0 && Math.random() < MOCK_FAIL_RATE;

    if (shouldFail) {
      return {
        paymentId: createId('pay'),
        bookingId: request.bookingId,
        status: 'FAILED',
        amount: request.amount,
      };
    }

    return {
      paymentId: createId('pay'),
      bookingId: request.bookingId,
      status: 'PAID',
      amount: request.amount,
      paidAt: new Date().toISOString(),
    };
  },
};
