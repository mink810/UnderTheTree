import { useCallback } from 'react';
import { type Href, useRouter } from 'expo-router';

import { sellerOnboardingService } from '../services/sellerOnboardingService';
import { useSellerApplication } from './useSellerApplication';

export function useSellerOnboarding() {
  const router = useRouter();
  const { application, loading, refresh } = useSellerApplication();

  const startApplication = useCallback(async () => {
    const current =
      application ?? (await sellerOnboardingService.getApplication());

    if (current.status === 'APPROVED') {
      router.replace('/seller-onboarding/complete' as Href);
      return;
    }

    const buyer = await sellerOnboardingService.getCurrentBuyer();
    router.push({
      pathname: '/seller-onboarding/verification',
      params: {
        userId: buyer.userId,
        nickname: buyer.nickname,
        age: buyer.age != null ? String(buyer.age) : '',
        region: buyer.region ?? '',
      },
    });
  }, [application, router]);

  return {
    application,
    loading,
    refresh,
    startApplication,
  };
}
