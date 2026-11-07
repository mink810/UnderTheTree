export function createMockBookingId(sellerId: string, productId: string): string {
  const stamp = Date.now().toString(36);
  return `bk_${sellerId}_${productId}_${stamp}`;
}
