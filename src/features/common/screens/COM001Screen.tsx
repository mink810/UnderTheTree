import * as SplashScreen from 'expo-splash-screen';
import { useRouter, type Href } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BRAND } from '@/constants/brand';
import { COLORS } from '@/constants/colors';
import { runAppBootstrap, type BootstrapResult } from '@/features/auth/services/appBootstrapService';

import AppBrandLogo from '../components/AppBrandLogo';

type Phase = 'splash' | 'error';

/**
 * COM-001 앱 진입 화면 (Splash)
 * 초기화·로그인 상태 확인 후 다음 화면으로 이동
 */
export default function COM001Screen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('splash');
  const [errorMessage, setErrorMessage] = useState('');

  const navigateAfterBootstrap = useCallback(
    async (result: BootstrapResult) => {
      await SplashScreen.hideAsync();

      if (result.kind === 'force_update') {
        router.replace('/force-update' as Href);
        return;
      }

      if (result.kind === 'error') {
        setErrorMessage(result.message);
        setPhase('error');
        return;
      }

      router.replace(result.nextHref);
    },
    [router]
  );

  const bootstrap = useCallback(async () => {
    setPhase('splash');
    setErrorMessage('');
    const result = await runAppBootstrap();
    await navigateAfterBootstrap(result);
  }, [navigateAfterBootstrap]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <View style={styles.container}>
      <AppBrandLogo />
      <Text style={styles.brandName}>{BRAND.name}</Text>
      <Text style={styles.slogan}>{BRAND.slogan}</Text>

      {phase === 'splash' ? (
        <ActivityIndicator
          style={styles.loader}
          color={COLORS.primary}
          accessibilityLabel="앱 초기화 중"
        />
      ) : null}

      {phase === 'error' ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>시작할 수 없어요</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Pressable style={styles.retryBtn} onPress={() => void bootstrap()}>
            <Text style={styles.retryText}>다시 시도</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.splashBackground,
    paddingHorizontal: 32,
  },
  brandName: {
    marginTop: 28,
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  slogan: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
  errorBox: {
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 15,
  },
});
