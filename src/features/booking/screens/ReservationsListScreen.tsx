import React, { useMemo, useState } from 'react';
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

import ReservationListCard from '@/features/booking/components/ReservationListCard';
import ReservationTabFilter from '@/features/booking/components/ReservationTabFilter';
import { useBookings } from '@/features/booking/hooks/useBookings';
import { bookingService } from '@/features/booking/services/bookingService';
import { ReservationTabKey } from '@/features/booking/types/booking.types';
import { filterBookingsByTab } from '@/features/booking/utils/bookingStatus';
import { COLORS } from '@/constants/colors';

export default function ReservationsListScreen() {
  const router = useRouter();
  const { bookings, loading, refresh } = useBookings();
  const [activeTab, setActiveTab] = useState<ReservationTabKey>('ALL');

  const filtered = useMemo(
    () => filterBookingsByTab(bookings, activeTab),
    [bookings, activeTab]
  );

  const handleCancelRequest = async (bookingId: string) => {
    await bookingService.requestCancel(bookingId);
    refresh();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>예약 내역</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>나의 예약</Text>
        <ReservationTabFilter activeTab={activeTab} onChange={setActiveTab} />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>예약 내역이 없어요</Text>
            <Text style={styles.emptyText}>
              마음에 드는 판매자를 찾아 첫 데이트를 예약해 보세요.
            </Text>
            <Pressable
              style={styles.homeButton}
              onPress={() => router.replace('/home')}
            >
              <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReservationListCard
                booking={item}
                onCancelRequest={handleCancelRequest}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 14,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  homeButton: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  homeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
