import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

import { getProductKindOption } from '../constants/sellerProductKinds';
import {
  SELLER_CATALOG_OWNER_ID,
  sellerProductCatalogService,
} from '../services/sellerProductCatalogService';
import { SellerCatalogProduct } from '../types/seller-product-catalog.types';

/** SELL-012 판매 상품 목록 */
export default function SELL012Screen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<SellerCatalogProduct[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await sellerProductCatalogService.listBySeller(
      SELLER_CATALOG_OWNER_ID
    );
    setProducts(list);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const canRegisterMore = products.length < 3;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>판매 상품 관리</Text>
        {canRegisterMore ? (
          <Pressable
            onPress={() => router.push('/seller/product-register')}
            style={styles.addBtn}
          >
            <Text style={styles.addText}>등록</Text>
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          color={COLORS.primary}
        />
      ) : products.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>등록된 상품이 없어요</Text>
          <Text style={styles.emptySub}>
            전화·커피·식사 데이트 상품을 등록해 보세요.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => router.push('/seller/product-register')}
          >
            <Text style={styles.emptyBtnText}>상품 등록하기</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const kind = getProductKindOption(item.kind);
            return (
              <Pressable
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/seller/product-register',
                    params: { productId: item.id },
                  })
                }
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardIcon}>{kind?.icon ?? '·'}</Text>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardMeta}>
                      {kind?.title} · {item.durationMinutes}분 ·{' '}
                      {item.price.toLocaleString()}원
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      !item.isActive && styles.statusPillOff,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        !item.isActive && styles.statusTextOff,
                      ]}
                    >
                      {item.isActive ? '판매 중' : '중지'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  back: { width: 44, padding: 8 },
  backText: { fontSize: 22, color: COLORS.text },
  title: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  addBtn: { padding: 8, paddingRight: 12 },
  addText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  loader: { marginTop: 40 },
  empty: { flex: 1, padding: 24, justifyContent: 'center', gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  emptySub: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '800' },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardIcon: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  cardMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillOff: { backgroundColor: COLORS.surfaceMuted },
  statusText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  statusTextOff: { color: COLORS.textMuted },
  cardDesc: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
