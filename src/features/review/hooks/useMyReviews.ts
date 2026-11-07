import { useCallback, useEffect, useMemo, useState } from 'react';
import { reviewService } from '../services/reviewService';
import { ReviewListItem, ReviewSortOption } from '../types/review-list.types';
import { sortReviewListItems } from '../utils/reviewSort';

export function useMyReviews(sort: ReviewSortOption) {
  const [items, setItems] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);

    return reviewService.getReviewListItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sortedItems = useMemo(
    () => sortReviewListItems(items, sort),
    [items, sort]
  );

  return {
    items: sortedItems,
    totalCount: items.length,
    loading,
    refresh,
  };
}
