import { useCallback, useEffect, useMemo, useState } from 'react';

import { sellerEditableProfileService } from '../services/sellerEditableProfileService';
import { SellerEditableProfile } from '../types/sellerEditableProfile.types';
import {
  isSellerProfileEditValid,
  validateSellerProfileEdit,
} from '../utils/sellerProfileEditValidation';

export function useSellerProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<SellerEditableProfile | null>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await sellerEditableProfileService.getProfile();
        if (mounted) {
          setProfile(data);
          setInitialSnapshot(JSON.stringify(data));
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

  const fieldErrors = useMemo(
    () => (profile ? validateSellerProfileEdit(profile) : {}),
    [profile]
  );

  const canSave = profile ? isSellerProfileEditValid(profile) : false;

  const isDirty = useMemo(() => {
    if (!profile) {
      return false;
    }
    return JSON.stringify(profile) !== initialSnapshot;
  }, [profile, initialSnapshot]);

  const updateProfile = useCallback((patch: Partial<SellerEditableProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const save = useCallback(async () => {
    if (!profile || !canSave) {
      return false;
    }
    setSaving(true);
    try {
      await sellerEditableProfileService.saveProfile(profile);
      setInitialSnapshot(JSON.stringify(profile));
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, [profile, canSave]);

  const resetToInitial = useCallback(() => {
    if (!initialSnapshot) {
      return;
    }
    setProfile(JSON.parse(initialSnapshot) as SellerEditableProfile);
  }, [initialSnapshot]);

  return {
    loading,
    saving,
    profile,
    updateProfile,
    fieldErrors,
    canSave,
    isDirty,
    save,
    resetToInitial,
  };
}
