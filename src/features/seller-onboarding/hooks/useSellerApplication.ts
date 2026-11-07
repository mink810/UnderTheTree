import { useCallback, useEffect, useState } from 'react';

import { sellerOnboardingService } from '../services/sellerOnboardingService';
import { SellerApplication } from '../types/sellerOnboarding.types';

export function useSellerApplication() {
  const [application, setApplication] = useState<SellerApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await sellerOnboardingService.getApplication();
      setApplication(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const next = await sellerOnboardingService.getApplication();
        if (mounted) {
          setApplication(next);
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

  return {
    application,
    loading,
    refresh,
  };
}
