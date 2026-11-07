import React, { useEffect, useState } from 'react';
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

import ApplicationStatusCard from '../components/ApplicationStatusCard';
import { APPLICATION_RECEIVED_INFO_ITEMS } from '../data/sellerOnboarding.mock';
import { sellerOnboardingService } from '../services/sellerOnboardingService';

function ReceivedHeroIcon() {
  return (
    <View style={styles.heroGlow}>
      <View style={styles.clipboard}>
        <Text style={styles.clipboardLines}>☰</Text>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      </View>
    </View>
  );
}

/** SELL-004 판매자 신청 완료 */
export default function SellerApplicationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [info, application] = await Promise.all([
        sellerOnboardingService.getBasicInfo(),
        sellerOnboardingService.getApplication(),
      ]);

      if (!mounted) {
        return;
      }

      if (!info || application.status === 'NOT_APPLIED') {
        router.replace('/seller-onboarding/profile');
        return;
      }

      setAllowed(true);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleConfirm = () => {
    router.replace('/home');
  };

  if (loading || !allowed) {
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
          onPress={handleConfirm}
          style={styles.headerSide}
          hitSlop={8}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>판매자 신청 완료</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 96 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ReceivedHeroIcon />
        <Text style={styles.title}>정보가 접수되었습니다.</Text>
        <Text style={styles.subtitle}>
          입력해주신 정보를 바탕으로{'\n'}판매자 심사가 진행돼요.
        </Text>

        <View style={styles.cardWrap}>
          <ApplicationStatusCard items={APPLICATION_RECEIVED_INFO_ITEMS} />
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
          onPress={handleConfirm}
        >
          <Text style={styles.primaryButtonText}>확인</Text>
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
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  heroGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  clipboard: {
    width: 56,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clipboardLines: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 4,
  },
  checkCircle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  checkMark: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  cardWrap: {
    width: '100%',
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
});
