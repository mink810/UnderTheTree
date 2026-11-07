import React from 'react';
import {
  ActivityIndicator,
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

import VerificationProgressIndicator from '../components/VerificationProgressIndicator';
import VerificationStatusCard from '../components/VerificationStatusCard';
import {
  VERIFICATION_INFO_NOTICES,
  VERIFICATION_PROGRESS_STEPS,
  VERIFICATION_REQUIREMENTS,
} from '../data/sellerOnboarding.mock';
import { useSellerVerification } from '../hooks/useSellerVerification';

function ShieldHeroIcon() {
  return (
    <View style={styles.shieldOuter}>
      <View style={styles.shieldInner}>
        <Text style={styles.shieldPerson}>👤</Text>
        <Text style={styles.shieldCheck}>✓</Text>
      </View>
    </View>
  );
}

function InfoNotice({ items }: { items: string[] }) {
  return (
    <View style={styles.infoBox}>
      <View style={styles.infoTitleRow}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>i</Text>
        </View>
        <Text style={styles.infoTitle}>안내사항</Text>
      </View>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function SellerVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    loading,
    submitting,
    startVerification,
    activeProgressStepId,
    verification,
  } = useSellerVerification();

  const bottomPad = 88 + insets.bottom;
  const isVerified = verification?.status === 'VERIFIED';

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>본인·성인 인증</Text>
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
          <ShieldHeroIcon />
          <Text style={styles.heroTitle}>본인 인증이 필요해요.</Text>
          <Text style={styles.heroSub}>
            안전한 서비스 이용과 판매자 등록을 위해{'\n'}
            본인 및 성인 인증을 진행해주세요.
          </Text>
        </View>

        <View style={styles.section}>
          <VerificationStatusCard items={VERIFICATION_REQUIREMENTS} />
        </View>

        <View style={styles.section}>
          <VerificationProgressIndicator
            steps={VERIFICATION_PROGRESS_STEPS}
            activeStepId={activeProgressStepId}
          />
        </View>

        <View style={styles.section}>
          <InfoNotice items={VERIFICATION_INFO_NOTICES} />
        </View>

        {isVerified ? (
          <Text style={styles.verifiedHint}>
            본인·성인 인증이 완료되었어요. 다음 단계로 이동할 수 있어요.
          </Text>
        ) : null}
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
            (pressed || submitting) && styles.primaryButtonPressed,
            submitting && styles.primaryButtonDisabled,
          ]}
          onPress={startVerification}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isVerified ? '판매자 정보 입력하기' : '본인 인증 시작하기'}
            </Text>
          )}
        </Pressable>
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
    paddingTop: 8,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
  },
  shieldOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shieldInner: {
    width: 56,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldPerson: {
    fontSize: 22,
  },
  shieldCheck: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  infoBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 13,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bullet: {
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  verifiedHint: {
    marginTop: 16,
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
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
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonDisabled: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
