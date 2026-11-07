import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { sellerOnboardingService } from '../services/sellerOnboardingService';
import { SellerIdentityVerification } from '../types/sellerOnboarding.types';

export function useSellerVerification() {
  const router = useRouter();
  const [verification, setVerification] =
    useState<SellerIdentityVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await sellerOnboardingService.getVerification();
      setVerification(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const next = await sellerOnboardingService.getVerification();
        if (mounted) {
          setVerification(next);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const goToProfileAfterVerification = useCallback(async () => {
    const buyer = await sellerOnboardingService.getCurrentBuyer();
    router.push({
      pathname: '/seller-onboarding/profile',
      params: {
        userId: buyer.userId,
        nickname: buyer.nickname,
        age: buyer.age != null ? String(buyer.age) : '',
        region: buyer.region ?? '',
      },
    });
  }, [router]);

  const startVerification = useCallback(async () => {
    if (verification?.status === 'VERIFIED') {
      await goToProfileAfterVerification();
      return;
    }

    setSubmitting(true);
    try {
      const result = await sellerOnboardingService.startIdentityVerification();
      const next = await sellerOnboardingService.getVerification();
      setVerification(next);

      if (result.success && result.isAdult) {
        await goToProfileAfterVerification();
        return;
      }

      Alert.alert(
        '인증 실패',
        result.failureReason ??
          '본인·성인 인증에 실패했어요. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setSubmitting(false);
    }
  }, [verification?.status, goToProfileAfterVerification]);

  const activeProgressStepId =
    verification?.status === 'VERIFIED'
      ? 'done'
      : verification?.status === 'IN_PROGRESS'
        ? 'confirm'
        : 'start';

  return {
    verification,
    loading,
    submitting,
    refresh,
    startVerification,
    activeProgressStepId,
  };
}
