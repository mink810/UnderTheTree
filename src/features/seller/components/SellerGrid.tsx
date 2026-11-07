import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Seller } from '../types/seller.types';
import SellerCard from './SellerCard';
import { COLORS } from '../../../constants/colors';

type Props = {
  sellers: Seller[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onSellerPress: (id: string) => void;
  loading?: boolean;
};

export default function SellerGrid({
  sellers,
  favoriteIds,
  onToggleFavorite,
  onSellerPress,
  loading = false,
}: Props) {
  if (loading) {
    return <Text style={styles.message}>판매자를 불러오는 중...</Text>;
  }

  return (
    <FlatList
      data={sellers}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>검색 결과가 없어요.</Text>
          <Text style={styles.emptyText}>
            지역이나 나이 필터를 변경해 보세요.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <SellerCard
          seller={item}
          favorite={favoriteIds.includes(item.id)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onPress={() => onSellerPress(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    gap: 13,
  },
  message: {
    textAlign: 'center',
    padding: 30,
    color: COLORS.textMuted,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
