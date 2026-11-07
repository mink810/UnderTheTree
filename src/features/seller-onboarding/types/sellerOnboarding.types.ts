export type SellerApplicationStatus =
  | 'NOT_APPLIED'
  | 'PENDING'
  | 'NEED_MORE_INFO'
  | 'APPROVED'
  | 'REJECTED';

export interface SellerApplication {
  userId: string;
  status: SellerApplicationStatus;
  appliedAt?: string;
}

export interface BuyerProfileSnapshot {
  userId: string;
  nickname: string;
  age?: number;
  region?: string;
}

export interface SellerIntroActivityItem {
  id: string;
  title: string;
  description: string;
  icon: 'profile' | 'products' | 'calendar' | 'settlement';
}

export interface SellerOnboardingStep {
  id: string;
  label: string;
  icon: 'info' | 'verify' | 'apply' | 'extra' | 'start';
}

export type IdentityVerificationStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'VERIFIED'
  | 'FAILED';

export type IdentityVerificationProviderId = 'mock' | 'nice' | 'danal';

export interface SellerIdentityVerification {
  userId: string;
  status: IdentityVerificationStatus;
  verifiedAt?: string;
  provider?: IdentityVerificationProviderId;
  isAdult?: boolean;
  /** 본인 인증 결과 — 사용자 입력으로 덮어쓰지 않음 */
  verifiedName?: string;
  /** 나이 계산용 (민감 정보 최소 보관) */
  birthYear?: number;
}

export interface SellerBasicInfo {
  userId: string;
  verifiedName: string;
  age: number;
  identityVerified: boolean;
  adultVerified: boolean;
  region: string;
  introduction: string;
  snsLinks: {
    instagram?: string;
    youtube?: string;
    other?: string;
  };
}

export type SellerBasicInfoDraft = Pick<
  SellerBasicInfo,
  'region' | 'introduction' | 'snsLinks'
>;

export type OnboardingFlowStepId = 'verification' | 'profile' | 'application';

export interface VerificationRequirementItem {
  id: string;
  title: string;
  description: string;
  icon: 'phone' | 'adult';
}

export interface VerificationProgressStep {
  id: string;
  label: string;
  icon: 'phone' | 'confirm' | 'complete';
}
