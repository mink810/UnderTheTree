import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SellerProduct } from '../types/seller-product.types';
import { COLORS } from '../../../constants/colors';

type Props = {
  product: SellerProduct;
  selected: boolean;
  onSelect: () => void;
};

export default function ProductSelectCard({
  product,
  selected,
  onSelect,
}: Props) {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.productName}>{product.name}</Text>
        <View
          style={[
            styles.badge,
            selected ? styles.badgeSelected : styles.badgeAvailable,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              selected ? styles.badgeTextSelected : styles.badgeTextAvailable,
            ]}
          >
            {selected ? '선택됨' : '선택 가능'}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.duration}>{product.durationMinutes}분</Text>
        <Text style={styles.price}>
          {product.price.toLocaleString('ko-KR')}원
        </Text>
      </View>

      <Pressable
        style={[styles.selectButton, selected && styles.selectButtonActive]}
        onPress={onSelect}
      >
        <Text
          style={[
            styles.selectButtonText,
            selected && styles.selectButtonTextActive,
          ]}
        >
          {selected ? '선택됨' : '선택하기'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    padding: 16,
    marginBottom: 20,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primaryLighter,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeAvailable: {
    backgroundColor: COLORS.successBg,
  },
  badgeSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextAvailable: {
    color: COLORS.success,
  },
  badgeTextSelected: {
    color: COLORS.primaryDark,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  description: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  duration: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  selectButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    backgroundColor: COLORS.surfaceMuted,
  },
  selectButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  selectButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  selectButtonTextActive: {
    color: COLORS.primaryDark,
  },
});
