import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { bookingService } from '@/features/booking/services/bookingService';
import { Booking } from '@/features/booking/types/booking.types';
import {
  getStatusBadgeLabel,
  getStatusSectionLabel,
} from '@/features/booking/utils/bookingStatus';
import { formatKoreanDateOnly } from '@/features/booking/utils/time';
import { COLORS } from '@/constants/colors';

export default function ReservationDetailScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!bookingId) {
      setLoading(false);
      return;
    }

    bookingService
      .getBookingById(bookingId)
      .then((data) => {
        if (mounted) {
          setBooking(data ?? null);
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
        <Text style={styles.error}>예약 정보를 찾을 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>예약 상세</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.section}>{getStatusSectionLabel(booking.status)}</Text>
          <Text style={styles.badge}>{getStatusBadgeLabel(booking)}</Text>
          <Text style={styles.number}>{booking.reservationNumber}</Text>

          <View style={styles.row}>
            <Image
              source={{ uri: booking.productImage }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.product}>{booking.productName}</Text>
              <Text style={styles.seller}>
                {booking.sellerNickname} · {booking.sellerAge}세
              </Text>
            </View>
          </View>

          <View style={styles.lineRow}>
            <Text style={styles.label}>예약 날짜</Text>
            <Text style={styles.value}>{formatKoreanDateOnly(booking.date)}</Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.label}>예약 시간</Text>
            <Text style={styles.value}>
              {booking.startTime} ~ {booking.endTime}
            </Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.label}>결제 금액</Text>
            <Text style={[styles.value, styles.priceBold]}>
              {booking.totalAmount.toLocaleString('ko-KR')}원
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  badge: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.success,
  },
  number: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  product: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  seller: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  priceBold: {
    fontWeight: '900',
    fontSize: 16,
  },
});
