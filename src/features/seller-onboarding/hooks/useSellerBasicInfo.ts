import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { sellerOnboardingService } from '../services/sellerOnboardingService';
import { SellerBasicInfoDraft } from '../types/sellerOnboarding.types';
import { formatVerifiedAgeLabel } from '../utils/ageFromBirthYear';
import {
  isSellerBasicInfoDraftValid,
  validateSellerBasicInfoDraft,
  SellerBasicInfoFieldErrors,
} from '../utils/sellerBasicInfoValidation';

const emptyDraft: SellerBasicInfoDraft = {
  region: '',
  introduction: '',
  snsLinks: {},
};

export function useSellerBasicInfo() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<SellerBasicInfoDraft>(emptyDraft);
  const [verifiedName, setVerifiedName] = useState('');
  const [ageLabel, setAgeLabel] = useState('');
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const [identity, savedDraft] = await Promise.all([
          sellerOnboardingService.getVerifiedIdentitySnapshot(),
          sellerOnboardingService.getBasicInfoDraft(),
        ]);

        if (!mounted) {
          return;
        }

        if (!identity?.identityVerified || !identity.adultVerified) {
          setCanAccess(false);
          router.replace('/seller-onboarding/verification');
          return;
        }

        const verification = await sellerOnboardingService.getVerification();
        const birthYear =
          verification.birthYear ??
          new Date().getFullYear() - identity.age;

        setCanAccess(true);
        setVerifiedName(identity.verifiedName);
        setAgeLabel(formatVerifiedAgeLabel(birthYear));
        setDraft(savedDraft);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  const fieldErrors: SellerBasicInfoFieldErrors = useMemo(
    () => validateSellerBasicInfoDraft(draft),
    [draft]
  );

  const canProceed = isSellerBasicInfoDraftValid(draft);

  const updateDraft = useCallback(
    (patch: Partial<SellerBasicInfoDraft> & { snsLinks?: Partial<SellerBasicInfoDraft['snsLinks']> }) => {
      setDraft((prev) => ({
        ...prev,
        ...patch,
        snsLinks: patch.snsLinks
          ? { ...prev.snsLinks, ...patch.snsLinks }
          : prev.snsLinks,
      }));
    },
    []
  );

  const submit = useCallback(async () => {
    if (!canProceed) {
      return;
    }

    setSubmitting(true);
    try {
      await sellerOnboardingService.saveBasicInfoDraft(draft);
      await sellerOnboardingService.submitSellerApplication();
      router.replace('/seller-onboarding/application');
    } finally {
      setSubmitting(false);
    }
  }, [canProceed, draft, router]);

  const goBackToVerification = useCallback(() => {
    router.replace('/seller-onboarding/verification');
  }, [router]);

  return {
    loading,
    submitting,
    canAccess,
    verifiedName,
    ageLabel,
    draft,
    updateDraft,
    fieldErrors,
    canProceed,
    submit,
    goBackToVerification,
  };
}
