import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSellers } from '@/features/seller/hooks/useSellers';
import SellerCard from '@/features/seller/components/SellerCard';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function LikesScreen() {
  const router = useRouter();
  const { sellers } = useSellers();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const favoriteSellers = sellers.filter((seller) =>
    favoriteIds.includes(seller.id)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>좋아요</Text>
      <Text style={styles.subtitle}>
        관심 있는 판매자를 모아봤어요.
      </Text>

      <FlatList
        data={favoriteSellers}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.heart}>♡</Text>
            <Text style={styles.emptyTitle}>
              아직 좋아요한 사람이 없어요.
            </Text>
            <Text style={styles.emptyText}>
              마음에 드는 판매자를 찾아보세요.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SellerCard
            seller={item}
            favorite={true}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() =>
              router.push({
                pathname: '/seller/[sellerId]',
                params: { sellerId: item.id },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    marginHorizontal: 20,
    marginTop: 15,
    color: COLORS.text,
  },
  subtitle: {
    marginHorizontal: 20,
    marginTop: 7,
    color: COLORS.textSubtle,
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  row: {
    gap: 13,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 100,
  },
  heart: {
    fontSize: 48,
    color: COLORS.primary,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 15,
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 8,
  },
});
