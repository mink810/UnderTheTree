import React, { useEffect, useState } from 'react';
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

import ProductSelectCard from '@/features/booking/components/ProductSelectCard';
import { MOCK_SELLER_AREA } from '@/features/booking/data/sellerProduct.mock';
import { useSellerProducts } from '@/features/booking/hooks/useSellerProducts';
import { sellerService } from '@/features/seller/services/sellerService';
import { Seller } from '@/features/seller/types/seller.types';
import { COLORS } from '@/constants/colors';

export default function ProductSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    sellerId: string;
    productId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    durationMinutes?: string;
    price?: string;
  }>();
  const { sellerId } = params;

  const [seller, setSeller] = useState<Seller | null>(null);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const { products, loading: productsLoading } = useSellerProducts(sellerId);

  useEffect(() => {
    if (params.productId) {
      setSelectedProductId(params.productId);
    }
  }, [params.productId]);

  useEffect(() => {
    let mounted = true;

    if (!sellerId) {
      setSellerLoading(false);
      return;
    }

    sellerService
      .getSellerById(sellerId)
      .then((data) => {
        if (mounted) {
          setSeller(data ?? null);
        }
      })
      .finally(() => {
        if (mounted) {
          setSellerLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [sellerId]);

  const loading = sellerLoading || productsLoading;
  const canProceed = Boolean(selectedProductId && sellerId);

  const handleNext = () => {
    if (!canProceed || !sellerId || !selectedProductId) {
      return;
    }

    router.push({
      pathname: '/booking/[sellerId]/calendar',
      params: {
        sellerId,
        productId: selectedProductId,
        ...(params.date ? { date: params.date } : {}),
        ...(params.startTime ? { startTime: params.startTime } : {}),
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!seller || !sellerId) {
    return (
      <SafeAreaView style={styles.loading} edges={['top']}>
        <Text style={styles.errorText}>판매자 정보를 불러올 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const areaLabel =
    MOCK_SELLER_AREA[seller.id] ?? `${seller.region}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerButton}
          hitSlop={8}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>상품 선택</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 24 + insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sellerSummary}>
          <Image
            source={{ uri: seller.imageUrl }}
            style={styles.sellerAvatar}
          />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>
              {seller.nickname} · {seller.age}세
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/seller/[sellerId]',
                  params: { sellerId: seller.id },
                })
              }
            >
              <Text style={styles.sellerMeta}>
                {areaLabel} ·{' '}
                <Text style={styles.profileLink}>판매자 프로필 보기</Text>
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>어떤 데이트를 원하세요?</Text>
        <Text style={styles.sectionSubtitle}>
          판매자가 제공하는 상품을 선택해주세요.
        </Text>

        {products.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              예약 가능한 상품이 없어요.
            </Text>
            <Text style={styles.emptyText}>
              다른 판매자를 둘러보거나 나중에 다시 확인해 주세요.
            </Text>
          </View>
        ) : (
          products.map((product) => (
            <ProductSelectCard
              key={product.id}
              product={product}
              selected={selectedProductId === product.id}
              onSelect={() => setSelectedProductId(product.id)}
            />
          ))
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          style={[
            styles.nextButton,
            !canProceed && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text
            style={[
              styles.nextButtonText,
              !canProceed && styles.nextButtonTextDisabled,
            ]}
          >
            다음 단계
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
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 12,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sellerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 24,
  },
  sellerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sellerMeta: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  profileLink: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  sectionSubtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
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
  nextButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.surfaceGray,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  nextButtonTextDisabled: {
    color: COLORS.textPlaceholder,
  },
});
