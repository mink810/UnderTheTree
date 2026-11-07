import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ACTIVE_VERIFICATION_PROVIDER,
  DEFAULT_IDENTITY_VERIFICATION,
  DEFAULT_SELLER_APPLICATION,
  DEV_MOCK_APPLICATION_PRESET,
  DEV_MOCK_VERIFICATION_PRESET,
  MOCK_CURRENT_BUYER,
  MOCK_VERIFIED_IDENTITY,
} from '../data/sellerOnboarding.mock';
import { calculateAgeFromBirthYear } from '../utils/ageFromBirthYear';
import {
  IdentityVerificationResult,
  getIdentityVerificationProvider,
} from './identityVerificationProvider';
import {
  SellerApplication,
  SellerBasicInfo,
  SellerBasicInfoDraft,
  SellerIdentityVerification,
} from '../types/sellerOnboarding.types';

const APPLICATION_KEY = '@my-date-app/seller-onboarding/application';
const VERIFICATION_KEY = '@my-date-app/seller-onboarding/verification';
const BASIC_INFO_KEY = '@my-date-app/seller-onboarding/basic-info';

let applicationCache: SellerApplication | null = null;
let verificationCache: SellerIdentityVerification | null = null;
let basicInfoCache: SellerBasicInfoDraft | null = null;

const ADULT_MIN_AGE = 19;

async function readStoredApplication(): Promise<SellerApplication> {
  if (DEV_MOCK_APPLICATION_PRESET) {
    return { ...DEV_MOCK_APPLICATION_PRESET };
  }

  if (applicationCache) {
    return { ...applicationCache };
  }

  try {
    const raw = await AsyncStorage.getItem(APPLICATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SellerApplication;
      applicationCache = parsed;
      return { ...parsed };
    }
  } catch {
    // Mock 환경: 저장 실패 시 기본값 사용
  }

  applicationCache = { ...DEFAULT_SELLER_APPLICATION };
  return { ...applicationCache };
}

async function readStoredVerification(): Promise<SellerIdentityVerification> {
  if (DEV_MOCK_VERIFICATION_PRESET) {
    return { ...DEV_MOCK_VERIFICATION_PRESET };
  }

  if (verificationCache) {
    return { ...verificationCache };
  }

  try {
    const raw = await AsyncStorage.getItem(VERIFICATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SellerIdentityVerification;
      verificationCache = parsed;
      return { ...parsed };
    }
  } catch {
    // ignore
  }

  verificationCache = { ...DEFAULT_IDENTITY_VERIFICATION };
  return { ...verificationCache };
}

async function persistApplication(application: SellerApplication): Promise<void> {
  applicationCache = { ...application };
  if (DEV_MOCK_APPLICATION_PRESET) {
    return;
  }
  try {
    await AsyncStorage.setItem(APPLICATION_KEY, JSON.stringify(application));
  } catch {
    // Mock: 메모리 캐시만 유지
  }
}

async function persistVerification(
  verification: SellerIdentityVerification
): Promise<void> {
  verificationCache = { ...verification };
  if (DEV_MOCK_VERIFICATION_PRESET) {
    return;
  }
  try {
    await AsyncStorage.setItem(VERIFICATION_KEY, JSON.stringify(verification));
  } catch {
    // Mock: 메모리 캐시만 유지
  }
}

export const sellerOnboardingService = {
  async getCurrentBuyer() {
    return Promise.resolve({ ...MOCK_CURRENT_BUYER });
  },

  async getApplication(): Promise<SellerApplication> {
    return readStoredApplication();
  },

  async saveApplication(application: SellerApplication): Promise<void> {
    await persistApplication(application);
  },

  async getVerification(): Promise<SellerIdentityVerification> {
    return readStoredVerification();
  },

  async saveVerification(
    verification: SellerIdentityVerification
  ): Promise<void> {
    await persistVerification(verification);
  },

  async startIdentityVerification(): Promise<IdentityVerificationResult> {
    const buyer = await this.getCurrentBuyer();
    const current = await readStoredVerification();

    await persistVerification({
      ...current,
      userId: buyer.userId,
      status: 'IN_PROGRESS',
      provider: ACTIVE_VERIFICATION_PROVIDER,
    });

    const provider = getIdentityVerificationProvider(
      ACTIVE_VERIFICATION_PROVIDER
    );
    const result = await provider.startVerification();

    if (result.success && result.isAdult) {
      await persistVerification({
        userId: buyer.userId,
        status: 'VERIFIED',
        verifiedAt: new Date().toISOString(),
        provider: result.provider,
        isAdult: true,
        verifiedName: MOCK_VERIFIED_IDENTITY.verifiedName,
        birthYear: MOCK_VERIFIED_IDENTITY.birthYear,
      });
    } else {
      await persistVerification({
        userId: buyer.userId,
        status: 'FAILED',
        provider: result.provider,
      });
    }

    return result;
  },

  async getVerifiedIdentitySnapshot(): Promise<{
    verifiedName: string;
    age: number;
    identityVerified: boolean;
    adultVerified: boolean;
  } | null> {
    const verification = await readStoredVerification();
    if (verification.status !== 'VERIFIED') {
      return null;
    }

    const birthYear =
      verification.birthYear ?? MOCK_VERIFIED_IDENTITY.birthYear;
    const verifiedName =
      verification.verifiedName ?? MOCK_VERIFIED_IDENTITY.verifiedName;
    const age = calculateAgeFromBirthYear(birthYear);

    return {
      verifiedName,
      age,
      identityVerified: true,
      adultVerified: verification.isAdult !== false && age >= ADULT_MIN_AGE,
    };
  },

  async getBasicInfoDraft(): Promise<SellerBasicInfoDraft> {
    if (basicInfoCache) {
      return { ...basicInfoCache, snsLinks: { ...basicInfoCache.snsLinks } };
    }

    try {
      const raw = await AsyncStorage.getItem(BASIC_INFO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SellerBasicInfoDraft;
        basicInfoCache = parsed;
        return {
          region: parsed.region ?? '',
          introduction: parsed.introduction ?? '',
          snsLinks: { ...parsed.snsLinks },
        };
      }
    } catch {
      // ignore
    }

    return {
      region: '',
      introduction: '',
      snsLinks: {},
    };
  },

  async saveBasicInfoDraft(draft: SellerBasicInfoDraft): Promise<SellerBasicInfo> {
    const buyer = await this.getCurrentBuyer();
    const identity = await this.getVerifiedIdentitySnapshot();
    if (!identity?.identityVerified || !identity.adultVerified) {
      throw new Error('본인·성인 인증이 완료되지 않았습니다.');
    }

    basicInfoCache = {
      region: draft.region,
      introduction: draft.introduction,
      snsLinks: { ...draft.snsLinks },
    };

    try {
      await AsyncStorage.setItem(BASIC_INFO_KEY, JSON.stringify(basicInfoCache));
    } catch {
      // Mock: 메모리만 유지
    }

    return {
      userId: buyer.userId,
      verifiedName: identity.verifiedName,
      age: identity.age,
      identityVerified: identity.identityVerified,
      adultVerified: identity.adultVerified,
      region: draft.region.trim(),
      introduction: draft.introduction.trim(),
      snsLinks: { ...draft.snsLinks },
    };
  },

  async submitSellerApplication(): Promise<SellerApplication> {
    const buyer = await this.getCurrentBuyer();
    const current = await readStoredApplication();
    const next: SellerApplication = {
      ...current,
      userId: buyer.userId,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    };
    await persistApplication(next);
    return next;
  },

  async getBasicInfo(): Promise<SellerBasicInfo | null> {
    const identity = await this.getVerifiedIdentitySnapshot();
    if (!identity) {
      return null;
    }

    const draft = await this.getBasicInfoDraft();
    if (!draft.region && !draft.introduction) {
      return null;
    }

    const buyer = await this.getCurrentBuyer();
    return {
      userId: buyer.userId,
      ...identity,
      region: draft.region,
      introduction: draft.introduction,
      snsLinks: { ...draft.snsLinks },
    };
  },

  async resetApplication(): Promise<void> {
    await persistApplication({ ...DEFAULT_SELLER_APPLICATION });
    await persistVerification({ ...DEFAULT_IDENTITY_VERIFICATION });
    basicInfoCache = null;
    try {
      await AsyncStorage.removeItem(BASIC_INFO_KEY);
    } catch {
      // ignore
    }
  },
};
