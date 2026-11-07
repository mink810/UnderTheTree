import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SellerReview } from '../types/seller-profile.types';
import { COLORS } from '../../../constants/colors';

type Props = {
  rating: number;
  reviewCount: number;
  reviews: SellerReview[];
};

export default function SellerReviewList({
  rating,
  reviewCount,
  reviews,
}: Props) {
  return (
    <View>
      <View style={styles.summary}>
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        <View>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.count}>후기 {reviewCount}개</Text>
        </View>
      </View>

      {reviews.slice(0, 3).map((review) => (
        <View key={review.id} style={styles.review}>
          <View style={styles.reviewHeader}>
            <Text style={styles.nickname}>
              {review.reviewerNickname}
            </Text>
            <Text style={styles.date}>{review.createdAt}</Text>
          </View>

          <Text style={styles.reviewStars}>
            {'★'.repeat(Math.round(review.rating))}
          </Text>

          <Text style={styles.content}>{review.content}</Text>
        </View>
      ))}

      {reviews.length === 0 && (
        <Text style={styles.empty}>아직 등록된 후기가 없어요.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 22,
    backgroundColor: COLORS.primaryLighter,
    padding: 20,
    borderRadius: 15,
  },
  rating: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
  },
  stars: {
    fontSize: 17,
    color: COLORS.star,
    letterSpacing: 2,
  },
  count: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  review: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nickname: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  date: {
    fontSize: 11,
    color: COLORS.textPlaceholder,
  },
  reviewStars: {
    fontSize: 12,
    color: COLORS.star,
    marginTop: 7,
  },
  content: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  empty: {
    fontSize: 13,
    color: COLORS.textSubtle,
    paddingVertical: 20,
  },
});
