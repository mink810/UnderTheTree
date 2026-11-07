import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { sellerProfileService } from '@/features/seller/services/sellerProfileService';
import { SellerProfile } from '@/features/seller/types/seller-profile.types';
import { Seller } from '@/features/seller/types/seller.types';
import { sellerService } from '@/features/seller/services/sellerService';

import ProfilePhotoGallery from '@/features/seller/components/ProfilePhotoGallery';
import ProfileSection from '@/features/seller/components/ProfileSection';
import SellerProductCard from '@/features/seller/components/SellerProductCard';
import SellerReviewList from '@/features/seller/components/SellerReviewList';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { COLORS } from '@/constants/colors';

export default function SellerProfileScreen() {
  const router = useRouter();
  const { sellerId } = useLocalSearchParams<{ sellerId: string }>();

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!sellerId) {
        setLoading(false);
        return;
      }

      try {
        const [profileData, sellerData] = await Promise.all([
          sellerProfileService.getProfile(sellerId),
          sellerService.getSellerById(sellerId),
        ]);

        if (mounted) {
          setProfile(profileData);
          setSeller(sellerData ?? null);
        }
      } catch (error) {
        console.error('프로필 조회 오류:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [sellerId]);

  const openSns = async (url?: string) => {
    if (!url) return;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('안내', '링크를 열 수 없어요.');
    }
  };

  const handleChat = () => {
    Alert.alert(
      '대화하기',
      '구매 전 대화 기능은 다음 개발 단계에서 연결할 예정이에요.'
    );
  };

  const handleBooking = () => {
    if (!sellerId) {
      return;
    }

    router.push({
      pathname: '/booking/[sellerId]/product-select',
      params: { sellerId },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!profile || !seller) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={styles.notFound}>판매자를 찾을 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(seller.id);
  const verification = profile.verification;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 상단 고정 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Text style={styles.headerIcon}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>프로필</Text>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => toggleFavorite(seller.id)}
          >
            <Text style={[styles.headerIcon, favorite && styles.heartActive]}>
              {favorite ? '♥' : '♡'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.headerButton}
            onPress={() =>
              Alert.alert('공유하기', '프로필 공유 기능은 추후 연결할게요.')
            }
          >
            <Text style={styles.headerIcon}>↗</Text>
          </Pressable>

          <Pressable
            style={styles.headerButton}
            onPress={() =>
              Alert.alert('더보기', '신고 기능은 추후 연결할게요.')
            }
          >
            <Text style={styles.headerIcon}>⋯</Text>
          </Pressable>
        </View>
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 프로필 사진 */}
        <ProfilePhotoGallery photos={profile.photos} />

        {/* 기본 정보 */}
        <View style={styles.basicInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.nickname}>{seller.nickname}</Text>
            <Text style={styles.age}>, {seller.age}</Text>
          </View>

          <View style={styles.verificationRow}>
            {verification.identityVerified && (
              <Text style={styles.verifiedBadge}>✓ 본인 인증</Text>
            )}
            {verification.adultVerified && (
              <Text style={styles.verifiedBadge}>✓ 성인 인증</Text>
            )}
            {verification.sellerApproved && (
              <Text style={styles.verifiedBadge}>✓ 판매자 승인</Text>
            )}
          </View>

          <Text style={styles.location}>
            {seller.region}
            {profile.height ? ` · ${profile.height}cm` : ''}
          </Text>

          <View style={styles.hashtagContainer}>
            {profile.hashtags.map((tag) => (
              <View key={tag} style={styles.hashtag}>
                <Text style={styles.hashtagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 자기소개 */}
        <ProfileSection title="ABOUT ME">
          <Text style={styles.introduction}>
            {profile.introduction}
          </Text>
        </ProfileSection>

        {/* 성격 */}
        {profile.personalityTags.length > 0 && (
          <ProfileSection title="나의 성격">
            <View style={styles.tagContainer}>
              {profile.personalityTags.map((tag) => (
                <View style={styles.keyword} key={tag}>
                  <Text style={styles.keywordText}>{tag}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        )}

        {/* 관심사 */}
        {profile.interests.length > 0 && (
          <ProfileSection title="MY INTERESTS">
            <View style={styles.interestList}>
              {profile.interests.map((interest, index) => (
                <View key={interest} style={styles.interestItem}>
                  <View style={styles.interestIcon}>
                    <Text style={styles.interestEmoji}>
                      {['☕', '✈️', '🏋️', '🎵', '🍽️'][index % 5]}
                    </Text>
                  </View>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>
        )}

        {/* 좋아하는 것 / 싫어하는 것 */}
        {(profile.favoriteThings || profile.thingsDisliked) && (
          <ProfileSection title="좋아하는 것과 싫어하는 것">
            {profile.favoriteThings ? (
              <View>
                <Text style={styles.subLabel}>좋아하는 것</Text>
                <Text style={styles.detailText}>
                  {profile.favoriteThings}
                </Text>
              </View>
            ) : null}

            {profile.thingsDisliked ? (
              <View>
                <Text style={styles.subLabel}>싫어하는 것</Text>
                <Text style={styles.detailText}>
                  {profile.thingsDisliked}
                </Text>
              </View>
            ) : null}
          </ProfileSection>
        )}

        {/* 데이트 스타일 */}
        {(profile.dateStyle || profile.idealDate) && (
          <ProfileSection title="MY DATE STYLE">
            {profile.dateStyle ? (
              <View>
                <Text style={styles.subLabel}>나의 데이트 스타일</Text>
                <Text style={styles.detailText}>
                  {profile.dateStyle}
                </Text>
              </View>
            ) : null}

            {profile.idealDate ? (
              <View>
                <Text style={styles.subLabel}>이상적인 데이트</Text>
                <Text style={styles.detailText}>
                  {profile.idealDate}
                </Text>
              </View>
            ) : null}
          </ProfileSection>
        )}

        {/* SNS */}
        {(profile.snsLinks.instagram || profile.snsLinks.youtube) && (
          <ProfileSection title="SNS">
            {profile.snsLinks.instagram && (
              <Pressable
                style={styles.snsButton}
                onPress={() => openSns(profile.snsLinks.instagram)}
              >
                <Text style={styles.snsIcon}>◎</Text>
                <Text style={styles.snsName}>Instagram</Text>
                <Text style={styles.snsArrow}>↗</Text>
              </Pressable>
            )}

            {profile.snsLinks.youtube && (
              <Pressable
                style={styles.snsButton}
                onPress={() => openSns(profile.snsLinks.youtube)}
              >
                <Text style={styles.youtubeIcon}>▶</Text>
                <Text style={styles.snsName}>YouTube</Text>
                <Text style={styles.snsArrow}>↗</Text>
              </Pressable>
            )}
          </ProfileSection>
        )}

        {/* 데이트 상품 */}
        <ProfileSection title="데이트 상품">
          {profile.products.map((product) => (
            <SellerProductCard
              key={product.type}
              product={product}
              region={seller.region}
              onPress={handleBooking}
            />
          ))}
        </ProfileSection>

        {/* 후기 */}
        <ProfileSection title="이용 후기">
          <SellerReviewList
            rating={profile.rating}
            reviewCount={profile.reviewCount}
            reviews={profile.reviews}
          />
        </ProfileSection>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.chatButtonText}>대화하기</Text>
        </Pressable>

        <Pressable
          style={styles.bookingButton}
          onPress={() => handleBooking()}
        >
          <Text style={styles.bookingButtonText}>예약하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: 16,
    color: COLORS.badgeDark,
    marginBottom: 15,
  },
  backText: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerButton: {
    width: 38,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 25,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartActive: {
    color: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  basicInfo: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 25,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nickname: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  age: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  verificationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
  },
  verifiedBadge: {
    backgroundColor: COLORS.successBg,
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  location: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 15,
  },
  hashtag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
  },
  hashtagText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  introduction: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  keyword: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceMuted,
  },
  keywordText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  interestList: {
    flexDirection: 'row',
    gap: 12,
  },
  interestItem: {
    flex: 1,
    alignItems: 'center',
    gap: 9,
  },
  interestIcon: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 13,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestEmoji: {
    fontSize: 27,
  },
  interestText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '800',
    marginBottom: 7,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  snsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    gap: 12,
  },
  snsIcon: {
    fontSize: 23,
    color: '#C45D85',
  },
  youtubeIcon: {
    fontSize: 19,
    color: '#E34B4B',
  },
  snsName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  snsArrow: {
    fontSize: 17,
    color: COLORS.textSubtle,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chatButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  bookingButton: {
    flex: 1.5,
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
  },
});
