import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  MOCK_VERIFIED_IDENTITY,
} from '@/features/seller-onboarding/data/sellerOnboarding.mock';
import { sellerOnboardingService } from '@/features/seller-onboarding/services/sellerOnboardingService';

import { SellerEditableProfile } from '../types/sellerEditableProfile.types';

const STORAGE_KEY = '@my-date-app/seller/editable-profile';

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
];

function defaultProfile(): SellerEditableProfile {
  return {
    photos: [...DEFAULT_PHOTOS],
    mainPhotoUri: DEFAULT_PHOTOS[0],
    name: '민수',
    age: '28',
    region: '서울특별시 강남구',
    heightCm: '180',
    favoriteThings: '',
    mbti: 'INFP',
    introduction:
      '안녕하세요! 따뜻한 대화와 좋은 추억을 만들 수 있는 만남을 선호해요.',
  };
}

async function loadFromOnboarding(): Promise<SellerEditableProfile | null> {
  const [identity, draft, basic] = await Promise.all([
    sellerOnboardingService.getVerifiedIdentitySnapshot(),
    sellerOnboardingService.getBasicInfoDraft(),
    sellerOnboardingService.getBasicInfo(),
  ]);

  const name =
    identity?.verifiedName ??
    basic?.verifiedName ??
    MOCK_VERIFIED_IDENTITY.verifiedName;
  const ageNum = identity?.age ?? basic?.age;
  const age = ageNum ? String(ageNum) : '28';
  const region = draft.region || basic?.region || '서울특별시 강남구';
  const introduction = draft.introduction || basic?.introduction || '';

  if (!name && !introduction && !draft.region) {
    return null;
  }

  return {
    ...defaultProfile(),
    name,
    age,
    region,
    introduction: introduction || defaultProfile().introduction,
  };
}

export const sellerEditableProfileService = {
  async getProfile(): Promise<SellerEditableProfile> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as SellerEditableProfile;
      }
    } catch {
      // fall through
    }

    const fromOnboarding = await loadFromOnboarding();
    return fromOnboarding ?? defaultProfile();
  },

  async saveProfile(profile: SellerEditableProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      throw new Error('SAVE_FAILED');
    }
  },
};
