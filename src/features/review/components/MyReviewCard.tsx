import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ReviewListItem } from '../types/review-list.types';
import {
  formatReviewCreatedDate,
} from '../utils/reviewSort';
import { formatKoreanDateOnly } from '../../booking/utils/time';
import ReviewImageViewer from './ReviewImageViewer';
import ReviewStarsDisplay from './ReviewStarsDisplay';
import { COLORS } from '../../../constants/colors';

const PREVIEW_LENGTH = 90;

type Props = {
  item: ReviewListItem;
};

export default function MyReviewCard({ item }: Props) {
  const router = useRouter();
  const { review } = item;
  const [expanded, setExpanded] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const needsCollapse = review.content.length > PREVIEW_LENGTH;
  const displayContent =
    expanded || !needsCollapse
      ? review.content
      : `${review.content.slice(0, PREVIEW_LENGTH)}…`;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const openDetail = () => {
    router.push({
      pathname: '/review/[bookingId]',
      params: {
        bookingId: review.bookingId,
        mode: 'view',
      },
    });
  };

  return (
    <>
      <Pressable style={styles.card} onPress={openDetail}>
        <View style={styles.topRow}>
          <Image source={{ uri: item.sellerImageUrl }} style={styles.avatar} />
          <View style={styles.topText}>
            <Text style={styles.seller}>
              {item.sellerNickname} · {item.sellerAge}세
            </Text>
            <Text style={styles.bookingMeta}>
              {item.productName} · {formatKoreanDateOnly(item.bookingDate)}
            </Text>
          </View>
          <Text style={styles.createdAt}>
            {formatReviewCreatedDate(review.createdAt)}
          </Text>
        </View>

        <ReviewStarsDisplay rating={review.rating} />

        {review.tags.length > 0 ? (
          <View style={styles.tags}>
            {review.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={styles.content}>{displayContent}</Text>

        {needsCollapse ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation?.();
              setExpanded((prev) => !prev);
            }}
            hitSlop={8}
          >
            <Text style={styles.more}>{expanded ? '접기' : '더보기'}</Text>
          </Pressable>
        ) : null}

        {review.images.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageRow}
          >
            {review.images.map((uri, imageIndex) => (
              <Pressable
                key={`${uri}-${imageIndex}`}
                onPress={(event) => {
                  event.stopPropagation?.();
                  openViewer(imageIndex);
                }}
              >
                <Image source={{ uri }} style={styles.thumb} />
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </Pressable>

      <ReviewImageViewer
        visible={viewerVisible}
        images={review.images}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceGray,
  },
  topText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  seller: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  bookingMeta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  createdAt: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.primaryLight,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
  more: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  imageRow: {
    gap: 8,
    marginTop: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceGray,
  },
});
