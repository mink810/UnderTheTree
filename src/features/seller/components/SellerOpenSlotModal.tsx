import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';

import { getProductKindOption } from '../constants/sellerProductKinds';
import {
  SELLER_CATALOG_OWNER_ID,
  sellerProductCatalogService,
} from '../services/sellerProductCatalogService';
import { SellerCatalogProduct } from '../types/seller-product-catalog.types';
import { SlotRepeatRule } from '../types/seller-schedule.types';

const REPEAT_OPTIONS: { id: SlotRepeatRule; label: string }[] = [
  { id: 'NONE', label: '반복 없음' },
  { id: 'WEEKLY_SAT', label: '매주 토요일' },
  { id: 'WEEKLY_SUN', label: '매주 일요일' },
  { id: 'WEEKDAYS', label: '평일 전체' },
];

type Props = {
  visible: boolean;
  dateKey: string;
  initialStart?: string;
  initialEnd?: string;
  initialProductId?: string;
  title?: string;
  showRepeat?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    startTime: string;
    endTime: string;
    productId: string;
    repeat: SlotRepeatRule;
  }) => Promise<void>;
};

export default function SellerOpenSlotModal({
  visible,
  dateKey,
  initialStart = '14:00',
  initialEnd = '15:00',
  initialProductId,
  title = '슬롯 열기',
  showRepeat = true,
  onClose,
  onSubmit,
}: Props) {
  const [products, setProducts] = useState<SellerCatalogProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(initialEnd);
  const [productId, setProductId] = useState<string | null>(initialProductId ?? null);
  const [repeat, setRepeat] = useState<SlotRepeatRule>('NONE');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingProducts(true);
      const list =
        await sellerProductCatalogService.listActiveForBuyer(
          SELLER_CATALOG_OWNER_ID
        );
      if (mounted) {
        setProducts(list);
        if (!initialProductId && list[0]) {
          setProductId(list[0].id);
        }
        setLoadingProducts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialProductId]);

  const handleSave = async () => {
    if (!productId) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ startTime, endTime, productId, repeat });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{title}</Text>
        <Text style={styles.sheetDate}>예약 날짜: {dateKey}</Text>

        <Text style={styles.label}>시작 시간 *</Text>
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={setStartTime}
          placeholder="14:00"
          placeholderTextColor={COLORS.textPlaceholder}
        />

        <Text style={styles.label}>종료 시간 *</Text>
        <TextInput
          style={styles.input}
          value={endTime}
          onChangeText={setEndTime}
          placeholder="15:00"
          placeholderTextColor={COLORS.textPlaceholder}
        />

        <Text style={styles.label}>예약 가능 상품 *</Text>
        {loadingProducts ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : products.length === 0 ? (
          <Text style={styles.warn}>
            판매 중인 상품이 없어요. 상품 관리에서 먼저 등록해 주세요.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((p) => {
              const selected = productId === p.id;
              const kind = getProductKindOption(p.kind);
              return (
                <Pressable
                  key={p.id}
                  style={[styles.productChip, selected && styles.productChipOn]}
                  onPress={() => setProductId(p.id)}
                >
                  <Text style={styles.productChipIcon}>{kind?.icon}</Text>
                  <Text
                    style={[
                      styles.productChipText,
                      selected && styles.productChipTextOn,
                    ]}
                  >
                    {p.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {showRepeat ? (
          <>
            <Text style={styles.label}>반복 설정</Text>
            <View style={styles.repeatRow}>
              {REPEAT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.id}
                  style={[
                    styles.repeatChip,
                    repeat === opt.id && styles.repeatChipOn,
                  ]}
                  onPress={() => setRepeat(opt.id)}
                >
                  <Text
                    style={[
                      styles.repeatText,
                      repeat === opt.id && styles.repeatTextOn,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        <Pressable
          style={[
            styles.saveBtn,
            (submitting || !productId) && styles.saveBtnDisabled,
          ]}
          disabled={submitting || !productId}
          onPress={handleSave}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveBtnText}>등록</Text>
          )}
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  sheetTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text },
  sheetDate: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
  },
  warn: { fontSize: 13, color: COLORS.primary, marginBottom: 8 },
  productChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 88,
  },
  productChipOn: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  productChipIcon: { fontSize: 20, marginBottom: 4 },
  productChipText: { fontSize: 12, fontWeight: '700', color: COLORS.text },
  productChipTextOn: { color: COLORS.primaryDark },
  repeatRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  repeatChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceMuted,
  },
  repeatChipOn: { backgroundColor: COLORS.primaryLight },
  repeatText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  repeatTextOn: { color: COLORS.primaryDark },
  saveBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: COLORS.borderDark },
  saveBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
});
