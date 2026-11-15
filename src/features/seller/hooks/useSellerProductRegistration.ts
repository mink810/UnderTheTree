import { useCallback, useEffect, useMemo, useState } from 'react';

import { getProductKindOption } from '../constants/sellerProductKinds';
import {
  SELLER_CATALOG_OWNER_ID,
  sellerProductCatalogService,
} from '../services/sellerProductCatalogService';
import {
  SellerProductKind,
  SellerProductRegistrationDraft,
} from '../types/seller-product-catalog.types';
import { validateProductRegistration } from '../utils/sellerProductRegistrationValidation';

const emptyDraft: SellerProductRegistrationDraft = {
  kind: null,
  name: '',
  description: '',
  price: '',
  durationMinutes: '',
  isActive: true,
};

function draftFromProduct(
  product: Awaited<ReturnType<typeof sellerProductCatalogService.getById>>
): SellerProductRegistrationDraft | null {
  if (!product) {
    return null;
  }
  return {
    kind: product.kind,
    name: product.name,
    description: product.description,
    price: String(product.price),
    durationMinutes: String(product.durationMinutes),
    isActive: product.isActive,
  };
}

export function useSellerProductRegistration(productId?: string) {
  const isEditMode = Boolean(productId);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<SellerProductRegistrationDraft>(emptyDraft);
  const [registeredKinds, setRegisteredKinds] = useState<SellerProductKind[]>(
    []
  );
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const kinds = await sellerProductCatalogService.getRegisteredKinds(
        SELLER_CATALOG_OWNER_ID
      );
      if (productId) {
        const product = await sellerProductCatalogService.getById(productId);
        const loaded = draftFromProduct(product);
        if (mounted) {
          if (loaded) {
            setDraft(loaded);
          }
          setRegisteredKinds(kinds);
          setLoading(false);
        }
        return;
      }
      if (mounted) {
        setRegisteredKinds(kinds);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const fieldErrors = useMemo(() => validateProductRegistration(draft), [draft]);

  const canSubmit = Object.keys(fieldErrors).length === 0;

  const isKindTaken = useCallback(
    (kind: SellerProductKind) => {
      if (isEditMode && draft.kind === kind) {
        return false;
      }
      return registeredKinds.includes(kind);
    },
    [registeredKinds, isEditMode, draft.kind]
  );

  const selectKind = useCallback(
    (kind: SellerProductKind) => {
      if (isEditMode) {
        return;
      }
      if (isKindTaken(kind)) {
        return;
      }
      const option = getProductKindOption(kind);
      if (!option) {
        return;
      }
      setDraft((prev) => ({
        ...prev,
        kind,
        name: prev.name || option.defaultName,
        price: prev.price || String(option.defaultPrice),
        durationMinutes:
          prev.durationMinutes || String(option.defaultDurationMinutes),
      }));
    },
    [isEditMode, isKindTaken]
  );

  const updateDraft = useCallback(
    (patch: Partial<SellerProductRegistrationDraft>) => {
      setDraft((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const submit = useCallback(async (): Promise<'ok' | 'duplicate' | 'fail'> => {
    setAttempted(true);
    if (draft.kind && isKindTaken(draft.kind)) {
      return 'duplicate';
    }
    if (!canSubmit) {
      return 'fail';
    }
    setSubmitting(true);
    try {
      if (isEditMode && productId) {
        await sellerProductCatalogService.updateProduct(productId, draft);
      } else {
        await sellerProductCatalogService.registerProduct(
          SELLER_CATALOG_OWNER_ID,
          draft
        );
      }
      return 'ok';
    } catch (e) {
      if (e instanceof Error && e.message === 'DUPLICATE_KIND') {
        return 'duplicate';
      }
      return 'fail';
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, draft, isEditMode, isKindTaken, productId]);

  return {
    loading,
    submitting,
    draft,
    updateDraft,
    selectKind,
    registeredKinds,
    isKindTaken,
    fieldErrors,
    canSubmit,
    attempted,
    submit,
    setAttempted,
    isEditMode,
  };
}
