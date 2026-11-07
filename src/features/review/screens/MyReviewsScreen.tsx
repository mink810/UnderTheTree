import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import MyReviewCard from '@/features/review/components/MyReviewCard';
import ReviewSortMenu from '@/features/review/components/ReviewSortMenu';
import { useMyReviews } from '@/features/review/hooks/useMyReviews';
import { ReviewSortOption } from '@/features/review/types/review-list.types';
import { REVIEW_SORT_LABELS } from '@/features/review/utils/reviewSort';
import { COLORS } from '@/constants/colors';

export default function MyReviewsScreen() {
  const router = useRouter();
  const [sort, setSort] = useState<ReviewSortOption>('NEWEST');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const { items, totalCount, loading, refresh } = useMyReviews(sort);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>내가 작성한 후기</Text>
        <View style={styles.back} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : totalCount === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>✎</Text>
          <Text style={styles.emptyTitle}>아직 작성한 후기가 없어요.</Text>
          <Text style={styles.emptyText}>
            데이트를 완료하고 소중한 경험을 공유해 보세요.
          </Text>
          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push('/reservations')}
          >
            <Text style={styles.emptyButtonText}>예약 내역으로 이동</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryIcon}>✎</Text>
            <Text style={styles.summaryText}>
              총 <Text style={styles.summaryCount}>{totalCount}개</Text>의
              후기를 작성했어요.
            </Text>
          </View>

          <Pressable
            style={styles.sortTrigger}
            onPress={() => setSortMenuVisible(true)}
          >
            <Text style={styles.sortLabel}>{REVIEW_SORT_LABELS[sort]}</Text>
            <Text style={styles.sortChevron}>⌄</Text>
          </Pressable>

          <FlatList
            data={items}
            keyExtractor={(item) => item.review.id}
            renderItem={({ item }) => <MyReviewCard item={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onRefresh={refresh}
            refreshing={loading}
          />
        </>
      )}

      <ReviewSortMenu
        visible={sortMenuVisible}
        selected={sort}
        onSelect={setSort}
        onClose={() => setSortMenuVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  back: {
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    gap: 8,
  },
  summaryIcon: {
    fontSize: 16,
    color: COLORS.primaryDark,
  },
  summaryText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryCount: {
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  sortTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 8,
    gap: 4,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  sortChevron: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    color: COLORS.primary,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
