import { SellerProductRegistrationDraft } from '../types/seller-product-catalog.types';

export function validateProductRegistration(
  draft: SellerProductRegistrationDraft
): Partial<Record<keyof SellerProductRegistrationDraft | 'duplicate', string>> {
  const errors: Partial<
    Record<keyof SellerProductRegistrationDraft | 'duplicate', string>
  > = {};

  if (!draft.kind) {
    errors.kind = '상품 종류를 선택해 주세요.';
  }

  if (!draft.name.trim()) {
    errors.name = '상품명을 입력해 주세요.';
  }

  if (!draft.description.trim()) {
    errors.description = '상품 설명을 입력해 주세요.';
  }

  const price = Number(draft.price.replace(/,/g, ''));
  if (!draft.price.trim()) {
    errors.price = '판매 가격을 입력해 주세요.';
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = '0보다 큰 숫자만 입력할 수 있어요.';
  }

  const minutes = Number(draft.durationMinutes);
  if (!draft.durationMinutes.trim()) {
    errors.durationMinutes = '이용 시간을 입력해 주세요.';
  } else if (!Number.isFinite(minutes) || minutes <= 0) {
    errors.durationMinutes = '0보다 큰 숫자만 입력할 수 있어요.';
  }

  return errors;
}
