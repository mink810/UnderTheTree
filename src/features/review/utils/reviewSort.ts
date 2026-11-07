import { ReviewListItem, ReviewSortOption } from '../types/review-list.types';

export const REVIEW_SORT_LABELS: Record<ReviewSortOption, string> = {
  NEWEST: '최신순',
  RATING_HIGH: '별점 높은순',
  RATING_LOW: '별점 낮은순',
};

export function sortReviewListItems(
  items: ReviewListItem[],
  sort: ReviewSortOption
): ReviewListItem[] {
  const copy = [...items];

  switch (sort) {
    case 'RATING_HIGH':
      return copy.sort((a, b) => {
        if (b.review.rating !== a.review.rating) {
          return b.review.rating - a.review.rating;
        }
        return (
          new Date(b.review.createdAt).getTime() -
          new Date(a.review.createdAt).getTime()
        );
      });
    case 'RATING_LOW':
      return copy.sort((a, b) => {
        if (a.review.rating !== b.review.rating) {
          return a.review.rating - b.review.rating;
        }
        return (
          new Date(b.review.createdAt).getTime() -
          new Date(a.review.createdAt).getTime()
        );
      });
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.review.createdAt).getTime() -
          new Date(a.review.createdAt).getTime()
      );
  }
}

export function formatReviewCreatedDate(iso: string): string {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}
