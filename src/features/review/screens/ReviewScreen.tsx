import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { bookingService } from '@/features/booking/services/bookingService';
import { Booking } from '@/features/booking/types/booking.types';
import { parseDateKey } from '@/features/booking/utils/time';
import ReviewPhotoPicker from '@/features/review/components/ReviewPhotoPicker';
import ReviewTagSelector from '@/features/review/components/ReviewTagSelector';
import StarRatingInput from '@/features/review/components/StarRatingInput';
import {
  MOCK_BUYER_ID,
  REVIEW_MAX_LENGTH,
  REVIEW_MIN_LENGTH,
} from '@/features/review/constants/reviewTags';
import { reviewService } from '@/features/review/services/reviewService';
import { Review } from '@/features/review/types/review.types';
import {
  canWriteReviewForBooking,
  getReviewBlockReason,
  getSatisfactionLabel,
  validateReviewInput,
} from '@/features/review/utils/reviewValidation';
import { sellerService } from '@/features/seller/services/sellerService';
import { Seller } from '@/features/seller/types/seller.types';
import { COLORS } from '@/constants/colors';

function formatUsedDateLabel(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookingId, mode } = useLocalSearchParams<{
    bookingId: string;
    mode?: string;
  }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const isViewMode = mode === 'view' || Boolean(existingReview);

  useEffect(() => {
    let mounted = true;

    if (!bookingId) {
      setLoading(false);
      return;
    }

    Promise.all([
      bookingService.getBookingById(bookingId),
      reviewService.getReviewByBookingId(bookingId),
    ])
      .then(async ([bookingData, reviewData]) => {
        if (!mounted) {
          return;
        }

        setBooking(bookingData ?? null);
        setExistingReview(reviewData ?? null);

        if (reviewData) {
          setRating(reviewData.rating);
          setTags(reviewData.tags);
          setContent(reviewData.content);
          setImages(reviewData.images);
        }

        if (bookingData) {
          const sellerData = await sellerService.getSellerById(
            bookingData.sellerId
          );
          if (mounted) {
            setSeller(sellerData ?? null);
          }
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  const blockReason = useMemo(() => {
    if (!booking || isViewMode) {
      return null;
    }

    return getReviewBlockReason(booking);
  }, [booking, isViewMode]);

  const canSubmit =
    !isViewMode &&
    !submitting &&
    booking &&
    canWriteReviewForBooking(booking) &&
    validateReviewInput(rating, content) === null;

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!booking || !canSubmit) {
      return;
    }

    const validationError = validateReviewInput(rating, content);

    if (validationError) {
      Alert.alert('입력 확인', validationError);
      return;
    }

    setSubmitting(true);

    try {
      await reviewService.createReview({
        bookingId: booking.id,
        sellerId: booking.sellerId,
        buyerId: MOCK_BUYER_ID,
        rating,
        tags,
        content: content.trim(),
        images,
      });

      await bookingService.markReviewWritten(booking.id, true);

      Alert.alert('등록 완료', '소중한 후기가 등록되었어요.', [
        {
          text: '확인',
          onPress: () => router.replace('/reservations'),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'DUPLICATE_REVIEW'
          ? '이미 작성한 후기가 있어요.'
          : '후기 등록에 실패했어요. 잠시 후 다시 시도해 주세요.';

      Alert.alert('등록 실패', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>예약 정보를 찾을 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (blockReason) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>{blockReason}</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const bottomHeight = 88 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerSide}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {isViewMode ? '후기 확인' : '후기 작성'}
        </Text>
        <View style={styles.headerSide} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: isViewMode ? 24 : bottomHeight + 16,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isViewMode ? (
            <>
              <Text style={styles.pageTitle}>오늘의 데이트는 어떠셨나요?</Text>
              <Text style={styles.pageSub}>
                소중한 경험을 다른 구매자와 나눠주세요.
              </Text>
            </>
          ) : null}

          <View style={styles.bookingCard}>
            <Image
              source={{
                uri: seller?.imageUrl ?? booking.productImage,
              }}
              style={styles.avatar}
            />
            <View style={styles.bookingText}>
              <Text style={styles.sellerName}>
                {booking.sellerNickname} · {booking.sellerAge}세
              </Text>
              <Text style={styles.bookingMeta}>
                {booking.productName} · {formatUsedDateLabel(booking.date)}
              </Text>
            </View>
          </View>

          <StarRatingInput
            label="전반적인 만족도"
            rating={rating}
            onChange={setRating}
            disabled={isViewMode}
          />
          <Text style={styles.ratingHint}>{getSatisfactionLabel(rating)}</Text>

          <Text style={styles.sectionTitle}>어떤 점이 좋았나요?</Text>
          <ReviewTagSelector
            selected={tags}
            onToggle={toggleTag}
            disabled={isViewMode}
          />

          <Text style={styles.sectionTitle}>자세한 후기를 작성해주세요</Text>
          <TextInput
            style={[styles.textArea, isViewMode && styles.textAreaReadonly]}
            value={content}
            onChangeText={(text) =>
              setContent(text.slice(0, REVIEW_MAX_LENGTH))
            }
            editable={!isViewMode}
            multiline
            placeholder="데이트 경험을 자유롭게 작성해주세요."
            placeholderTextColor={COLORS.textPlaceholder}
            textAlignVertical="top"
          />
          {!isViewMode ? (
            <View style={styles.counterRow}>
              <Text style={styles.counterHint}>
                최소 {REVIEW_MIN_LENGTH}자 이상
              </Text>
              <Text style={styles.counter}>
                {content.trim().length} / {REVIEW_MAX_LENGTH}자
              </Text>
            </View>
          ) : null}

          <View style={styles.photoSection}>
            {isViewMode && images.length === 0 ? (
              <Text style={styles.noPhoto}>첨부된 사진이 없어요.</Text>
            ) : (
              <ReviewPhotoPicker
                images={images}
                onChange={setImages}
                disabled={isViewMode}
              />
            )}
          </View>
        </ScrollView>

        {!isViewMode ? (
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <Pressable
              style={[
                styles.submitButton,
                !canSubmit && styles.submitButtonDisabled,
              ]}
              disabled={!canSubmit}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>후기 등록하기</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  backLink: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  headerSide: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  pageTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  pageSub: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 22,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  bookingText: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  bookingMeta: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  ratingHint: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  textArea: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  textAreaReadonly: {
    backgroundColor: COLORS.surfaceMuted,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  counterHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  counter: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 12,
  },
  noPhoto: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surfaceGray,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
});
