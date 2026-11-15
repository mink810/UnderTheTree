import {
  PROFILE_INTRO_MIN,
  PROFILE_INTRO_MAX,
} from '../constants/profileEdit';
import {
  SellerEditableProfile,
  SellerProfileEditFieldErrors,
} from '../types/sellerEditableProfile.types';

export function validateSellerProfileEdit(
  profile: SellerEditableProfile
): SellerProfileEditFieldErrors {
  const errors: SellerProfileEditFieldErrors = {};

  if (profile.photos.length === 0) {
    errors.photos = '프로필 사진을 한 장 이상 등록해 주세요.';
  }

  if (!profile.mainPhotoUri || !profile.photos.includes(profile.mainPhotoUri)) {
    errors.mainPhotoUri = '메인 사진을 지정해 주세요.';
  }

  const name = profile.name.trim();
  if (!name) {
    errors.name = '이름을 입력해 주세요.';
  }

  const age = profile.age.trim();
  if (!age) {
    errors.age = '나이를 입력해 주세요.';
  } else if (!/^\d{1,2}$/.test(age) || Number(age) < 19 || Number(age) > 99) {
    errors.age = '올바른 나이(19~99)를 입력해 주세요.';
  }

  if (!profile.region.trim()) {
    errors.region = '지역을 선택해 주세요.';
  }

  const height = profile.heightCm.trim();
  if (height && (!/^\d{2,3}$/.test(height) || Number(height) < 100 || Number(height) > 250)) {
    errors.heightCm = '키는 100~250cm 사이로 입력해 주세요.';
  }

  const intro = profile.introduction.trim();
  if (!intro) {
    errors.introduction = '자기소개를 입력해 주세요.';
  } else if (intro.length < PROFILE_INTRO_MIN) {
    errors.introduction = `자기소개는 ${PROFILE_INTRO_MIN}자 이상 작성해 주세요.`;
  } else if (intro.length > PROFILE_INTRO_MAX) {
    errors.introduction = `자기소개는 ${PROFILE_INTRO_MAX}자 이내로 작성해 주세요.`;
  }

  return errors;
}

export function isSellerProfileEditValid(
  profile: SellerEditableProfile
): boolean {
  return Object.keys(validateSellerProfileEdit(profile)).length === 0;
}
