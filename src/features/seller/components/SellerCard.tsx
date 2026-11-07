import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Seller } from '../types/seller.types';
import { COLORS } from '../../../constants/colors';

type Props = {
  seller: Seller;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
};

export default function SellerCard({
  seller,
  favorite,
  onToggleFavorite,
  onPress,
}: Props) {
  const lowestPrice = Math.min(
    ...seller.products.map((product) => product.price)
  );

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: seller.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.badges}>
          {seller.isAd && <Text style={styles.adBadge}>AD</Text>}
          {seller.isNew && <Text style={styles.newBadge}>NEW</Text>}
        </View>

        <Pressable
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          hitSlop={8}
        >
          <Text style={[styles.favoriteIcon, favorite && styles.favoriteActive]}>
            {favorite ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.nickname}>{seller.nickname}</Text>
          <Text style={styles.age}>{seller.age}세</Text>
        </View>

        <Text style={styles.region}>{seller.region}</Text>

        <Text style={styles.product} numberOfLines={1}>
          {seller.products[0]?.name}
        </Text>

        <Text style={styles.price}>
          {lowestPrice.toLocaleString('ko-KR')}원~
        </Text>

        <Text style={styles.rating}>
          ★ {seller.rating.toFixed(1)} · 리뷰 {seller.reviewCount}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 22,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badges: {
    position: 'absolute',
    top: 9,
    left: 9,
    flexDirection: 'row',
    gap: 5,
  },
  adBadge: {
    color: COLORS.white,
    backgroundColor: COLORS.badgeDark,
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },
  newBadge: {
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 7,
    right: 9,
    width: 34,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 22,
    color: COLORS.textMuted,
  },
  favoriteActive: {
    color: COLORS.primary,
  },
  info: {
    paddingTop: 9,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  nickname: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  age: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  region: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  product: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 7,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 4,
  },
  rating: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 5,
  },
});
