import { Review } from './review.types';

export type ReviewSortOption = 'NEWEST' | 'RATING_HIGH' | 'RATING_LOW';

export interface ReviewListItem {
  review: Review;
  sellerNickname: string;
  sellerAge: number;
  sellerImageUrl: string;
  productName: string;
  bookingDate: string;
}
