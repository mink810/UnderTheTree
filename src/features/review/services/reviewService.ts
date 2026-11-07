import { bookingService } from '../../booking/services/bookingService';
import { sellerService } from '../../seller/services/sellerService';
import { MOCK_REVIEWS } from '../data/review.mock';
import { MOCK_BUYER_ID } from '../constants/reviewTags';
import { ReviewListItem } from '../types/review-list.types';
import { CreateReviewInput, Review } from '../types/review.types';

let reviewsStore = [...MOCK_REVIEWS];

function createId(): string {
  return `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const reviewService = {
  async getReviewsByBuyerId(
    buyerId: string = MOCK_BUYER_ID
  ): Promise<Review[]> {
    return Promise.resolve(
      reviewsStore
        .filter((review) => review.buyerId === buyerId)
        .slice()
    );
  },

  async getReviewListItems(
    buyerId: string = MOCK_BUYER_ID
  ): Promise<ReviewListItem[]> {
    const reviews = await this.getReviewsByBuyerId(buyerId);
    const items: ReviewListItem[] = [];

    for (const review of reviews) {
      const booking = await bookingService.getBookingById(review.bookingId);
      const seller = await sellerService.getSellerById(review.sellerId);

      items.push({
        review,
        sellerNickname: booking?.sellerNickname ?? seller?.nickname ?? '판매자',
        sellerAge: booking?.sellerAge ?? seller?.age ?? 0,
        sellerImageUrl:
          seller?.imageUrl ??
          booking?.productImage ??
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        productName: booking?.productName ?? '데이트 상품',
        bookingDate: booking?.date ?? review.createdAt.slice(0, 10),
      });
    }

    return Promise.resolve(items);
  },

  async getReviewByBookingId(
    bookingId: string
  ): Promise<Review | undefined> {
    return Promise.resolve(
      reviewsStore.find((review) => review.bookingId === bookingId)
    );
  },

  async hasReview(bookingId: string): Promise<boolean> {
    return Promise.resolve(
      reviewsStore.some((review) => review.bookingId === bookingId)
    );
  },

  async createReview(input: CreateReviewInput): Promise<Review> {
    const exists = reviewsStore.some(
      (review) => review.bookingId === input.bookingId
    );

    if (exists) {
      throw new Error('DUPLICATE_REVIEW');
    }

    const review: Review = {
      id: createId(),
      ...input,
      createdAt: new Date().toISOString(),
    };

    reviewsStore = [...reviewsStore, review];
    return Promise.resolve(review);
  },
};
