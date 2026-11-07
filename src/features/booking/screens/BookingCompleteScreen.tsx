import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { MOCK_SELLER_AREA } from '@/features/booking/data/sellerProduct.mock';
import { sellerProductService } from '@/features/booking/services/sellerProductService';
import { SellerProduct } from '@/features/booking/types/seller-product.types';
import {
  bookingCompleteToRouteParams,
  parseBookingCompleteParams,
} from '@/features/booking/utils/bookingComplete';
import { formatKoreanDateOnly } from '@/features/booking/utils/time';
import { sellerService } from '@/features/seller/services/sellerService';
import { Seller } from '@/features/seller/types/seller.types';
import { COLORS } from '@/constants/colors';

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, bold && styles.infoValueBold]}>{value}</Text>
    </View>
  );
}

export default function BookingCompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();

  const booking = useMemo(() => parseBookingCompleteParams(params), [params]);

  const [seller, setSeller] = useState<Seller | null>(null);
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!booking) {
      setLoading(false);
      return;
    }

    Promise.all([
      sellerService.getSellerById(booking.sellerId),
      sellerProductService.getProductById(booking.productId),
    ])
      .then(([sellerData, productData]) => {
        if (mounted) {
          setSeller(sellerData ?? null);
          setProduct(productData ?? null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
  }, [booking]);

  useEffect(() => {
    if (!loading && !booking) {
      router.replace('/home');
    }
  }, [loading, booking, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!booking || !seller || !product) {
    return null;
  }

  const routePayload = bookingCompleteToRouteParams(booking);
  const areaLabel = MOCK_SELLER_AREA[seller.id] ?? seller.region;

  const openDetail = () => {
    router.push({
      pathname: '/reservation/[bookingId]',
      params: {
        bookingId: booking.bookingId,
        ...routePayload,
      },
    });
  };

  const openChat = () => {
    router.push({
      pathname: '/chat/[bookingId]',
      params: {
        bookingId: booking.bookingId,
        sellerId: booking.sellerId,
        reservationNumber: booking.reservationNumber,
      },
    });
  };

  const goHome = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successArea}>
          <View style={styles.successIconWrap}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>예약이 완료되었어요!</Text>
          <Text style={styles.successSub}>
            결제가 정상적으로 처리되었습니다.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>예약 정보</Text>

          <View style={styles.reservationHeader}>
            <Text style={styles.reservationLabel}>예약 번호</Text>
            <Text style={styles.reservationNumber}>
              {booking.reservationNumber}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>예약 확정</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.sellerRow}>
            <Image source={{ uri: seller.imageUrl }} style={styles.avatar} />
            <View>
              <Text style={styles.sellerName}>
                {seller.nickname} · {seller.age}세
              </Text>
              <Text style={styles.sellerArea}>{areaLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <InfoRow label="상품" value={product.name} />
          <InfoRow
            label="예약 날짜"
            value={formatKoreanDateOnly(booking.date)}
          />
          <InfoRow
            label="예약 시간"
            value={`${booking.startTime} ~ ${booking.endTime}`}
          />
          <InfoRow
            label="결제 금액"
            value={`${booking.totalAmount.toLocaleString('ko-KR')}원`}
            bold
          />
        </View>

        <View style={styles.chatCard}>
          <Text style={styles.chatTitle}>💬 판매자와 대화하기</Text>
          <Text style={styles.chatBody}>
            예약 관련 내용을 판매자와 이야기할 수 있어요. 대화 가능 기간은
            예약 정책에 따라 적용됩니다.
          </Text>
          <Pressable style={styles.chatButton} onPress={openChat}>
            <Text style={styles.chatButtonText}>대화하기</Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryButton} onPress={openDetail}>
          <Text style={styles.primaryButtonText}>예약 상세 보기</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={goHome}>
          <Text style={styles.secondaryButtonText}>홈으로 돌아가기</Text>
        </Pressable>
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  successArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.success,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  successSub: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  reservationNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.successBg,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 14,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceGray,
    marginRight: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sellerArea: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  infoValueBold: {
    fontSize: 16,
    fontWeight: '900',
  },
  chatCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 20,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  chatBody: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  chatButton: {
    marginTop: 14,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surfaceMuted,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  secondaryButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});
