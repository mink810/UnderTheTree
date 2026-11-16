import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BRAND } from '@/constants/brand';
import { COLORS } from '@/constants/colors';
import { authSessionService } from '@/features/auth/services/authSessionService';
import { supabase } from '@/services/supabase';

import AppBrandLogo from '../components/AppBrandLogo';

/**
 * 스플래시 직후 테스트 진입 (임시)
 * 운영 전에는 appBootstrapService 분기를 원래대로 되돌릴 것
 */
export default function TestEntryScreen() {
  const router = useRouter();

  const goLoginTest = async () => {
    await authSessionService.signOut();
    router.replace('/login' as Href);
  };

  const goSellerTest = async () => {
    await authSessionService.signOut();
    router.push('/seller-onboarding' as Href);
  };

  const goBuyerTest = async () => {
    await authSessionService.signInDemo();
    router.replace('/home' as Href);
  };

  const testSelect = async () => {
    const { data, error } = await supabase
      .from('test_connection')
      .select('*');

    console.log('조회 결과:', data);
    console.log('에러:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppBrandLogo size={72} />
        <Text style={styles.brandName}>{BRAND.name}</Text>
        <Text style={styles.caption}>개발·테스트 진입</Text>
      </View>

      <Text style={styles.hint}>
        스플래시 이후 이동할 화면을 선택해 주세요.
      </Text>

      <Pressable style={styles.btnPrimary} onPress={() => void goLoginTest()}>
        <Text style={styles.btnPrimaryText}>로그인 테스트</Text>
        <Text style={styles.btnSub}>로그인 화면 (COM-002)</Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={() => void goSellerTest()}>
        <Text style={styles.btnSecondaryText}>판매자용 테스트</Text>
        <Text style={styles.btnSubDark}>판매자 등록 화면 (SELL-001)</Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={() => void goBuyerTest()}>
        <Text style={styles.btnSecondaryText}>구매자용 테스트</Text>
        <Text style={styles.btnSubDark}>판매자 리스트 홈 (BUY-001)</Text>
      </Pressable>

      <Pressable style={styles.btnSecondary} onPress={() => void testSelect()}>
        <Text style={styles.btnSecondaryText}>DB 연결 테스트</Text>
        <Text style={styles.btnSubDark}>test_connection 조회 · 콘솔 확인</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.splashBackground,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandName: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  caption: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
  },
  btnSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  btnSub: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  btnSubDark: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});