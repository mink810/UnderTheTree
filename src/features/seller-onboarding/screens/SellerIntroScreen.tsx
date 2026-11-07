import React from 'react';
import {
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
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

import OnboardingNotice from '../components/OnboardingNotice';
import OnboardingStepIndicator from '../components/OnboardingStepIndicator';
import {
  SELLER_INTRO_ACTIVITIES,
  SELLER_INTRO_HERO,
  SELLER_INTRO_NOTICES,
  SELLER_ONBOARDING_STEPS,
} from '../data/sellerOnboarding.mock';
import { useSellerOnboarding } from '../hooks/useSellerOnboarding';
import { SellerIntroActivityItem } from '../types/sellerOnboarding.types';

function ActivityIcon({ icon }: { icon: SellerIntroActivityItem['icon'] }) {
  const glyph =
    icon === 'profile'
      ? '👤'
      : icon === 'products'
        ? '▦'
        : icon === 'calendar'
          ? '📅'
          : '💰';

  return (
    <View style={styles.activityIconWrap}>
      <Text style={styles.activityIcon}>{glyph}</Text>
    </View>
  );
}

function ActivityCard({ item }: { item: SellerIntroActivityItem }) {
  return (
    <View style={styles.activityCard}>
      <ActivityIcon icon={item.icon} />
      <View style={styles.activityText}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDesc}>{item.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

export default function SellerIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { startApplication } = useSellerOnboarding();

  const bottomPad = 88 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerSide}
          hitSlop={8}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>판매자 시작하기</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 16 },
        ]}
      >
        <View style={styles.hero}>
          <Image
            source={{ uri: SELLER_INTRO_HERO.imageUrl }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroHeadline}>
              {SELLER_INTRO_HERO.headline}
              {'\n'}
              <Text style={styles.heroAccent}>
                {SELLER_INTRO_HERO.headlineAccent}
              </Text>
              {SELLER_INTRO_HERO.headlineSuffix} 💕
            </Text>
            <Text style={styles.heroSub}>{SELLER_INTRO_HERO.subheadline}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          판매자로 이런 활동을 할 수 있어요
        </Text>
        <View style={styles.activityList}>
          {SELLER_INTRO_ACTIVITIES.map((item) => (
            <ActivityCard key={item.id} item={item} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>판매자 등록 절차</Text>
        <OnboardingStepIndicator steps={SELLER_ONBOARDING_STEPS} />

        <View style={styles.noticeWrap}>
          <OnboardingNotice items={SELLER_INTRO_NOTICES} />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={startApplication}
        >
          <Text style={styles.primaryButtonText}>판매자 신청 시작하기</Text>
        </Pressable>
        <Text style={styles.footerHint}>
          신청 후 심사 결과에 따라 판매자 활동이 시작됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  scrollContent: {
    paddingBottom: 24,
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 200,
    backgroundColor: COLORS.surfaceMuted,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  heroCopy: {
    padding: 20,
    paddingTop: 24,
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 30,
  },
  heroAccent: {
    color: COLORS.primary,
  },
  heroSub: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    marginHorizontal: 20,
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  activityList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIcon: {
    fontSize: 20,
  },
  activityText: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  activityDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.textSubtle,
  },
  noticeWrap: {
    marginTop: 28,
    marginHorizontal: 16,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  footerHint: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
});
