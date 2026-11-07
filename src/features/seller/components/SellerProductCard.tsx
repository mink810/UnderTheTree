import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DateProduct } from '../types/seller.types';
import { COLORS } from '../../../constants/colors';

type Props = {
  product: DateProduct;
  region: string;
  onPress: () => void;
};

const PRODUCT_DURATION: Record<DateProduct['type'], string> = {
  phone: '30분',
  coffee: '60분',
  meal: '90분',
};

export default function SellerProductCard({
  product,
  region,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.top}>
        <View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>
            {PRODUCT_DURATION[product.type]} · {region}
          </Text>
        </View>

        <View style={styles.priceArea}>
          <Text style={styles.price}>
            {product.price.toLocaleString('ko-KR')}원
          </Text>
          <Text style={styles.available}>예약 가능</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.detail}>상품 상세 보기</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    marginBottom: 11,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 7,
  },
  priceArea: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  available: {
    fontSize: 11,
    color: COLORS.success,
    marginTop: 5,
  },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 15,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  arrow: {
    color: COLORS.textPlaceholder,
    fontSize: 18,
  },
});
