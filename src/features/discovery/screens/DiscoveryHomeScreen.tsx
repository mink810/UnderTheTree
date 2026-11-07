import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useSellers } from '@/features/seller/hooks/useSellers';
import SellerGrid from '@/features/seller/components/SellerGrid';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useDiscovery, SortType } from '@/features/discovery/hooks/useDiscovery';
import { COLORS } from '@/constants/colors';

const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대전', '광주'];

const SORTS: SortType[] = [
  '추천순',
  '최신순',
  '인기순',
  '평점순',
];

export default function DiscoveryHomeScreen() {
  const router = useRouter();

  const { sellers, loading } = useSellers();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const {
    selectedRegion,
    setSelectedRegion,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    sortType,
    setSortType,
    keyword,
    setKeyword,
    filteredSellers,
  } = useDiscovery(sellers);

  const [filterVisible, setFilterVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const [draftRegion, setDraftRegion] = useState(selectedRegion);
  const [draftMinAge, setDraftMinAge] = useState(minAge);
  const [draftMaxAge, setDraftMaxAge] = useState(maxAge);

  const openFilter = () => {
    setDraftRegion(selectedRegion);
    setDraftMinAge(minAge);
    setDraftMaxAge(maxAge);
    setFilterVisible(true);
  };

  const applyFilter = () => {
    setSelectedRegion(draftRegion);
    setMinAge(draftMinAge);
    setMaxAge(draftMaxAge);
    setFilterVisible(false);
  };

  const resetFilter = () => {
    setDraftRegion('전체');
    setDraftMinAge(20);
    setDraftMaxAge(39);
  };

  const handleSellerPress = (id: string) => {
    router.push({
      pathname: '/seller/[sellerId]',
      params: { sellerId: id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>데이트.</Text>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerIcon}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Text style={styles.iconText}>⌕</Text>
          </Pressable>

          <Pressable
            style={styles.headerIcon}
            onPress={() => router.push('/notifications')}
          >
            <Text style={styles.iconText}>♧</Text>
          </Pressable>
        </View>
      </View>

      {/* 검색창 */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="닉네임으로 검색해 보세요."
            placeholderTextColor={COLORS.textPlaceholder}
            style={styles.searchInput}
            autoFocus
          />
          <Pressable onPress={() => setKeyword('')}>
            <Text style={styles.clearText}>초기화</Text>
          </Pressable>
        </View>
      )}

      {/* 필터 영역 */}
      <View style={styles.filterArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <Pressable style={styles.filterChip} onPress={openFilter}>
            <Text style={styles.filterChipText}>
              지역 · {selectedRegion}⌄
            </Text>
          </Pressable>

          <Pressable style={styles.filterChip} onPress={openFilter}>
            <Text style={styles.filterChipText}>
              나이 · {minAge}~{maxAge}세⌄
            </Text>
          </Pressable>

          <Pressable
            style={styles.filterChip}
            onPress={openFilter}
          >
            <Text style={styles.filterChipText}>＋ 추가 필터</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* 목록 제목 및 정렬 */}
      <View style={styles.listHeader}>
        <View>
          <Text style={styles.sectionTitle}>만나보고 싶은 사람</Text>
          <Text style={styles.resultCount}>
            {filteredSellers.length}명의 판매자
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContainer}
        >
          {SORTS.map((sort) => (
            <Pressable
              key={sort}
              onPress={() => setSortType(sort)}
            >
              <Text
                style={[
                  styles.sortText,
                  sortType === sort && styles.sortTextActive,
                ]}
              >
                {sort}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 판매자 목록만 스크롤 */}
      <View style={styles.listContainer}>
        <SellerGrid
          sellers={filteredSellers}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSellerPress={handleSellerPress}
          loading={loading}
        />
      </View>

      {/* 필터 모달 */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setFilterVisible(false)}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>필터 설정</Text>
              <Pressable onPress={() => setFilterVisible(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.filterTitle}>지역 선택</Text>

            <View style={styles.regionGrid}>
              {REGIONS.map((region) => (
                <Pressable
                  key={region}
                  style={[
                    styles.regionOption,
                    draftRegion === region && styles.optionActive,
                  ]}
                  onPress={() => setDraftRegion(region)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      draftRegion === region && styles.optionTextActive,
                    ]}
                  >
                    {region}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.filterTitle}>나이 범위</Text>

            <View style={styles.ageOptions}>
              {[
                [20, 29],
                [25, 34],
                [30, 39],
                [20, 39],
              ].map(([min, max]) => (
                <Pressable
                  key={`${min}-${max}`}
                  style={[
                    styles.ageOption,
                    draftMinAge === min &&
                      draftMaxAge === max &&
                      styles.optionActive,
                  ]}
                  onPress={() => {
                    setDraftMinAge(min);
                    setDraftMaxAge(max);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      draftMinAge === min &&
                        draftMaxAge === max &&
                        styles.optionTextActive,
                    ]}
                  >
                    {min}~{max}세
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.resetButton}
                onPress={resetFilter}
              >
                <Text style={styles.resetText}>초기화</Text>
              </Pressable>

              <Pressable
                style={styles.applyButton}
                onPress={applyFilter}
              >
                <Text style={styles.applyText}>필터 적용</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 27,
    color: COLORS.text,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 43,
    fontSize: 13,
    color: COLORS.text,
  },
  clearText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    padding: 8,
  },
  filterArea: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },
  resultCount: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 4,
  },
  sortContainer: {
    gap: 18,
  },
  sortText: {
    fontSize: 12,
    color: COLORS.textSubtle,
    paddingVertical: 5,
  },
  sortTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  listContainer: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 35,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeText: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 14,
    marginTop: 8,
    color: COLORS.text,
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 22,
  },
  regionOption: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  ageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 28,
  },
  ageOption: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  optionActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  optionTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  applyText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
