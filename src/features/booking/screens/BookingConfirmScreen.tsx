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

import AgreementChecklist, {
  AgreementKey,
  allAgreementsChecked,
} from '@/features/booking/components/AgreementChecklist';
import ConfirmSectionCard from '@/features/booking/components/ConfirmSectionCard';
import { MOCK_SELLER_AREA } from '@/features/booking/data/sellerProduct.mock';
import { sellerProductService } from '@/features/booking/services/sellerProductService';
import { SellerProduct } from '@/features/booking/types/seller-product.types';
import {
  buildBookingConfirmation,
  confirmationToRouteParams,
  routeParamsToSelection,
} from '@/features/booking/utils/bookingConfirmation';
import {
  pickScheduleParams,
  scheduleParamsToRecord,
} from '@/features/booking/utils/bookingParams';
import { formatKoreanDateFull } from '@/features/booking/utils/time';
import { sellerService } from '@/features/seller/services/sellerService';
import { Seller } from '@/features/seller/types/seller.types';
import { COLORS } from '@/constants/colors';

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

export default function BookingConfirmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    sellerId: string;
    productId: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: string;
    price: string;
    additionalFee?: string;
    discountAmount?: string;
  }>();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<
    Record<AgreementKey, boolean>
  >({
    usageGuide: false,
    refundPolicy: false,
    termsAndPayment: false,
  });

  const selection = useMemo(
    () => routeParamsToSelection(params),
    [
      params.sellerId,
      params.productId,
      params.date,
      params.startTime,
      params.endTime,
      params.durationMinutes,
      params.price,
    ]
  );
  const scheduleParams = pickScheduleParams(params);

  const confirmation = useMemo(() => {
    if (!selection) {
      return null;
    }

    return buildBookingConfirmation(
      selection,
      Number(params.additionalFee ?? 0),
      Number(params.discountAmount ?? 0)
    );
  }, [selection, params.additionalFee, params.discountAmount]);

  useEffect(() => {
    let mounted = true;

    if (!selection) {
      setLoading(false);
      return;
    }

    Promise.all([
      sellerService.getSellerById(selection.sellerId),
      sellerProductService.getProductById(selection.productId),
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

    return () => {
      mounted = false;
    };
  }, [selection]);

  const toggleAgreement = (key: AgreementKey) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const canPay = allAgreementsChecked(agreements) && confirmation !== null;

  const handlePay = () => {
    if (!canPay || !confirmation) {
      return;
    }

    router.push({
      pathname: '/booking/[sellerId]/payment',
      params: {
        sellerId: confirmation.sellerId,
        ...confirmationToRouteParams(confirmation),
      },
    });
  };

  const handleEditSeller = () => {
    if (!selection) {
      router.back();
      return;
    }

    router.push({
      pathname: '/seller/[sellerId]',
      params: { sellerId: selection.sellerId },
    });
  };

  const handleEditProduct = () => {
    if (!selection) {
      return;
    }

    router.push({
      pathname: '/booking/[sellerId]/product-select',
      params: {
        sellerId: selection.sellerId,
        productId: selection.productId,
        ...scheduleParamsToRecord(scheduleParams),
      },
    });
  };

  const handleEditSchedule = () => {
    if (!selection) {
      return;
    }

    router.push({
      pathname: '/booking/[sellerId]/calendar',
      params: {
        sellerId: selection.sellerId,
        productId: selection.productId,
        date: selection.date,
        startTime: selection.startTime,
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!selection || !confirmation || !seller || !product) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>예약 정보를 확인할 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const areaLabel =
    MOCK_SELLER_AREA[seller.id] ?? seller.region;

  const bottomHeight = 88 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerSide}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>예약 정보 확인</Text>
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
        <Text style={styles.pageTitle}>예약 내용을 확인해주세요</Text>

        <ConfirmSectionCard
          title="예약 상대"
          onEdit={handleEditSeller}
          editLabel="프로필"
        >
          <View style={styles.row}>
            <Image source={{ uri: seller.imageUrl }} style={styles.avatar} />
            <View style={styles.rowText}>
              <Text style={styles.name}>
                {seller.nickname} · {seller.age}세
              </Text>
              <Text style={styles.sub}>{areaLabel}</Text>
              <Pressable onPress={handleEditSeller}>
                <Text style={styles.link}>판매자 프로필 보기</Text>
              </Pressable>
            </View>
          </View>
        </ConfirmSectionCard>

        <ConfirmSectionCard title="선택한 상품" onEdit={handleEditProduct}>
          <View style={styles.row}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
            />
            <View style={styles.rowText}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.sub}>{product.description}</Text>
              <Text style={styles.meta}>
                {product.durationMinutes}분 ·{' '}
                {product.price.toLocaleString('ko-KR')}원
              </Text>
            </View>
          </View>
        </ConfirmSectionCard>

        <ConfirmSectionCard title="예약 일정" onEdit={handleEditSchedule}>
          <SummaryRow
            label="날짜"
            value={formatKoreanDateFull(selection.date)}
          />
          <SummaryRow label="시작 시간" value={selection.startTime} />
          <SummaryRow label="종료 예정" value={selection.endTime} />
          <SummaryRow
            label="시간대"
            value={`${selection.startTime} ~ ${selection.endTime} (${selection.durationMinutes}분)`}
          />
        </ConfirmSectionCard>

        <ConfirmSectionCard title="결제 금액">
          <SummaryRow
            label="상품 금액"
            value={`${confirmation.productPrice.toLocaleString('ko-KR')}원`}
          />
          <SummaryRow
            label="추가 비용"
            value={`${confirmation.additionalFee.toLocaleString('ko-KR')}원`}
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

        <View style={styles.guideBox}>
          <Text style={styles.guideIcon}>✓</Text>
          <View style={styles.guideTextWrap}>
            <Text style={styles.guideTitle}>예약 및 결제 안내</Text>
            <Text style={styles.guideBody}>
              결제가 완료되고 예약이 확정되면 예약 상세 정보와 대화 기능을
              이용할 수 있습니다. 취소·환불은 서비스 정책에 따라 처리됩니다.
            </Text>
          </View>
        </View>

        <AgreementChecklist
          checked={agreements}
          onToggle={toggleAgreement}
        />
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          style={[styles.payButton, !canPay && styles.payButtonDisabled]}
          disabled={!canPay}
          onPress={handlePay}
        >
          <Text
            style={[
              styles.payButtonText,
              !canPay && styles.payButtonTextDisabled,
            ]}
          >
            결제하기 · {confirmation.totalAmount.toLocaleString('ko-KR')}원
          </Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  link: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
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
  guideBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  guideIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.successBg,
    color: COLORS.success,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '800',
    fontSize: 12,
  },
  guideTextWrap: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  guideBody: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
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
  payButtonTextDisabled: {
    color: COLORS.textPlaceholder,
  },
});
