import { useRouter, type Href } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/colors';

import { authSessionService } from '../services/authSessionService';

type Props = {
  children: React.ReactNode;
};

/** 구매자 영역 — 로그인 세션 없으면 COM-002로 이동 */
export default function BuyerAuthGate({ children }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await authSessionService.clearInvalidSessions();
      const loggedIn = await authSessionService.isLoggedIn();
      if (!mounted) {
        return;
      }
      if (!loggedIn) {
        router.replace('/login' as Href);
        return;
      }
      setAllowed(true);
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (allowed !== true) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
