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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ConfirmSectionCard from '@/features/booking/components/ConfirmSectionCard';
import PaymentMethodSelector from '@/features/booking/components/PaymentMethodSelector';
import { sellerProductService } from '@/features/booking/services/sellerProductService';
import { mockPaymentService } from '@/features/booking/services/mockPaymentService';
import { BookingConfirmation } from '@/features/booking/types/booking-confirmation.types';
import {
  PaymentLifecycleStatus,
  PaymentMethod,
} from '@/features/booking/types/payment.types';
import { confirmationToRouteParams } from '@/features/booking/utils/bookingConfirmation';
import { createReservationNumber } from '@/features/booking/utils/bookingComplete';
import { createMockBookingId } from '@/features/booking/utils/bookingId';
import { formatKoreanDateTimeSummary } from '@/features/booking/utils/time';
import { sellerService } from '@/features/seller/services/sellerService';
import { Seller } from '@/features/seller/types/seller.types';
import { SellerProduct } from '@/features/booking/types/seller-product.types';
import { COLORS } from '@/constants/colors';

function parseConfirmation(
  params: Record<string, string | undefined>
): BookingConfirmation | null {
  if (
    !params.sellerId ||
    !params.productId ||
    !params.date ||
    !params.startTime ||
    !params.endTime
  ) {
    return null;
  }

  return {
    sellerId: params.sellerId,
    productId: params.productId,
    date: params.date,
    startTime: params.startTime,
    endTime: params.endTime,
    durationMinutes: Number(params.durationMinutes ?? 0),
    productPrice: Number(params.price ?? 0),
    additionalFee: Number(params.additionalFee ?? 0),
    discountAmount: Number(params.discountAmount ?? 0),
    totalAmount: Number(params.totalAmount ?? 0),
  };
}

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>
        {value}
      </Text>
    </View>
  );
}

export default function BookingPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();

  const confirmation = useMemo(() => parseConfirmation(params), [params]);

  const bookingId = useMemo(() => {
    if (!confirmation) {
      return null;
    }

    return createMockBookingId(
      confirmation.sellerId,
      confirmation.productId
    );
  }, [confirmation]);

  const [seller, setSeller] = useState<Seller | null>(null);
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentLifecycleStatus>('READY');
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!confirmation) {
      setPageLoading(false);
      return;
    }

    Promise.all([
      sellerService.getSellerById(confirmation.sellerId),
      sellerProductService.getProductById(confirmation.productId),
    ])
      .then(([sellerData, productData]) => {
        if (mounted) {
          setSeller(sellerData ?? null);
          setProduct(productData ?? null);
        }
      })
      .finally(() => {
        if (mounted) {
          setPageLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [confirmation]);

  const isProcessing = paymentStatus === 'PROCESSING';
  const canPay =
    paymentStatus === 'READY' ||
    paymentStatus === 'FAILED';

  const handlePay = async () => {
    if (!confirmation || !bookingId || !canPay || isProcessing) {
      return;
    }

    setFailureMessage(null);
    setPaymentStatus('PROCESSING');

    try {
      const result = await mockPaymentService.processPayment(
        {
          bookingId,
          amount: confirmation.totalAmount,
          paymentMethod,
        },
        retryAttempt
      );

      if (result.status === 'PAID') {
        setPaymentStatus('PAID');

        router.replace({
          pathname: '/booking/[sellerId]/complete',
          params: {
            sellerId: confirmation.sellerId,
            ...confirmationToRouteParams(confirmation),
            bookingId: result.bookingId,
            paymentId: result.paymentId,
            paidAt: result.paidAt ?? '',
            reservationNumber: createReservationNumber(
              confirmation.date,
              result.bookingId
            ),
            paymentStatus: 'PAID',
            bookingStatus: 'CONFIRMED',
          },
        });
        return;
      }

      setPaymentStatus('FAILED');
      setFailureMessage(
        '결제에 실패했어요. 카드 한도나 네트워크 상태를 확인한 뒤 다시 시도해 주세요.'
      );
    } catch {
      setPaymentStatus('FAILED');
      setFailureMessage('결제 처리 중 오류가 발생했어요.');
    }
  };

  const handleRetry = () => {
    setRetryAttempt((count) => count + 1);
    setPaymentStatus('READY');
    setFailureMessage(null);
  };

  if (pageLoading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!confirmation || !seller || !product) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>결제 정보를 불러올 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const scheduleLabel = formatKoreanDateTimeSummary(
    confirmation.date,
    confirmation.startTime
  );

  const bottomHeight = 88 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerSide}
          disabled={isProcessing}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>결제하기</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: bottomHeight + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>결제 정보를 확인해주세요</Text>

        <ConfirmSectionCard title="예약 상품">
          <View style={styles.productRow}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.productText}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSub}>
                {seller.nickname} · {seller.age}세
              </Text>
              <Text style={styles.productSchedule}>
                {scheduleLabel} · {confirmation.durationMinutes}분
              </Text>
            </View>
          </View>
        </ConfirmSectionCard>

        <ConfirmSectionCard title="결제 금액">
          <SummaryRow
            label="상품 금액"
            value={`${confirmation.productPrice.toLocaleString('ko-KR')}원`}
          />
          <SummaryRow
            label="할인 금액"
            value={
              confirmation.discountAmount > 0
                ? `-${confirmation.discountAmount.toLocaleString('ko-KR')}원`
                : '0원'
            }
          />
          <View style={styles.divider} />
          <SummaryRow
            label="최종 결제 금액"
            value={`${confirmation.totalAmount.toLocaleString('ko-KR')}원`}
            bold
          />
        </ConfirmSectionCard>

        <Text style={styles.sectionTitle}>결제 수단 선택</Text>
        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
          disabled={isProcessing}
        />

        <View style={styles.secureBox}>
          <Text style={styles.secureIcon}>🛡</Text>
          <View style={styles.secureTextWrap}>
            <Text style={styles.secureTitle}>안전한 결제 안내</Text>
            <Text style={styles.secureBody}>
              결제는 안전한 결제 시스템을 통해 처리됩니다. 데이트 이용 완료
              확인 후 판매자 정산이 진행됩니다.
            </Text>
          </View>
        </View>

        {paymentStatus === 'PROCESSING' ? (
          <View style={styles.processingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.processingText}>결제를 진행하고 있어요…</Text>
          </View>
        ) : null}

        {paymentStatus === 'FAILED' && failureMessage ? (
          <View style={styles.failureBox}>
            <Text style={styles.failureTitle}>결제 실패</Text>
            <Text style={styles.failureBody}>{failureMessage}</Text>
            <Pressable style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          style={[
            styles.payButton,
            (!canPay || isProcessing) && styles.payButtonDisabled,
          ]}
          disabled={!canPay || isProcessing}
          onPress={handlePay}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.payButtonText}>
              {confirmation.totalAmount.toLocaleString('ko-KR')}원 결제하기
            </Text>
          )}
        </Pressable>
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
  errorText: {
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
  scroll: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 18,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  productText: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  productSub: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  productSchedule: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 8,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  secureBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 20,
  },
  secureIcon: {
    fontSize: 18,
  },
  secureTextWrap: {
    flex: 1,
  },
  secureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  secureBody: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  processingBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLighter,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  failureBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D4D4',
    backgroundColor: '#FFF5F5',
  },
  failureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#B42318',
  },
  failureBody: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
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
  payButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLORS.surfaceGray,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
});
