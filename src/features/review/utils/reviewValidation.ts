import { Booking } from '../../booking/types/booking.types';
import { REVIEW_MIN_LENGTH } from '../constants/reviewTags';

export function canWriteReviewForBooking(booking: Booking): boolean {
  return booking.status === 'COMPLETED' && !booking.reviewWritten;
}

export function getReviewBlockReason(booking: Booking): string | null {
  if (booking.status !== 'COMPLETED') {
    return '이용이 완료된 예약만 후기를 작성할 수 있어요.';
  }

  if (booking.reviewWritten) {
    return '이미 작성한 후기가 있어요.';
  }

  return null;
}

export function validateReviewInput(
  rating: number,
  content: string
): string | null {
  if (rating < 1 || rating > 5) {
    return '별점을 선택해 주세요.';
  }

  const trimmed = content.trim();

  if (trimmed.length < REVIEW_MIN_LENGTH) {
    return `후기는 ${REVIEW_MIN_LENGTH}자 이상 작성해 주세요.`;
  }

  return null;
}

export function getSatisfactionLabel(rating: number): string {
  switch (rating) {
    case 1:
      return '별로예요';
    case 2:
      return '아쉬워요';
    case 3:
      return '보통이에요';
    case 4:
      return '만족해요';
    case 5:
      return '최고예요!';
    default:
      return '별점을 선택해주세요.';
  }
}
