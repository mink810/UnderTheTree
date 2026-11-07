import { SellerBasicInfoDraft } from '../types/sellerOnboarding.types';

const INTRO_MIN = 10;
const INTRO_MAX = 500;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isValidInstagram(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }
  if (trimmed.startsWith('http')) {
    return /instagram\.com/i.test(trimmed) && isValidUrl(trimmed);
  }
  return /^@?[a-zA-Z0-9._]{1,30}$/.test(trimmed);
}

function isValidOptionalUrl(value: string | undefined): boolean {
  if (!value?.trim()) {
    return true;
  }
  return isValidUrl(value.trim());
}

export type SellerBasicInfoFieldErrors = Partial<
  Record<'region' | 'introduction' | 'instagram' | 'youtube' | 'other', string>
>;

export function validateSellerBasicInfoDraft(
  draft: SellerBasicInfoDraft
): SellerBasicInfoFieldErrors {
  const errors: SellerBasicInfoFieldErrors = {};

  if (!draft.region.trim()) {
    errors.region = '지역을 선택해 주세요.';
  }

  const introLen = draft.introduction.trim().length;
  if (introLen < INTRO_MIN) {
    errors.introduction = `자기소개는 ${INTRO_MIN}자 이상 입력해 주세요.`;
  } else if (introLen > INTRO_MAX) {
    errors.introduction = `자기소개는 ${INTRO_MAX}자 이내로 입력해 주세요.`;
  }

  if (draft.snsLinks.instagram && !isValidInstagram(draft.snsLinks.instagram)) {
    errors.instagram = '인스타그램 아이디 또는 URL 형식을 확인해 주세요.';
  }

  if (!isValidOptionalUrl(draft.snsLinks.youtube)) {
    errors.youtube = '유튜브 URL 형식을 확인해 주세요.';
  }

  if (!isValidOptionalUrl(draft.snsLinks.other)) {
    errors.other = 'SNS URL 형식을 확인해 주세요.';
  }

  return errors;
}

export function isSellerBasicInfoDraftValid(
  draft: SellerBasicInfoDraft
): boolean {
  return Object.keys(validateSellerBasicInfoDraft(draft)).length === 0;
}

export const SELLER_INTRO_MAX_LENGTH = INTRO_MAX;
