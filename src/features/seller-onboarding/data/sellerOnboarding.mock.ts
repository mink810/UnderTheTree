import {
  BuyerProfileSnapshot,
  SellerApplication,
  SellerIdentityVerification,
  SellerIntroActivityItem,
  SellerOnboardingStep,
  VerificationProgressStep,
  VerificationRequirementItem,
} from '../types/sellerOnboarding.types';

/** Mock 로그인 구매자 (다음 화면에서 프로필 재사용) */
export const MOCK_CURRENT_BUYER: BuyerProfileSnapshot = {
  userId: 'buyer-001',
  nickname: '민지',
  age: 26,
  region: '서울',
};

export const DEFAULT_SELLER_APPLICATION: SellerApplication = {
  userId: MOCK_CURRENT_BUYER.userId,
  status: 'NOT_APPLIED',
};

/**
 * 상태별 화면 테스트 시 아래 값을 설정한다.
 * null이면 AsyncStorage에 저장된 값(없으면 NOT_APPLIED)을 사용한다.
 */
export const DEV_MOCK_APPLICATION_PRESET: SellerApplication | null = null;

export const DEFAULT_IDENTITY_VERIFICATION: SellerIdentityVerification = {
  userId: MOCK_CURRENT_BUYER.userId,
  status: 'NOT_STARTED',
};

export const DEV_MOCK_VERIFICATION_PRESET: SellerIdentityVerification | null =
  null;

/** 실제 연동 시 `nice` 등으로 변경 (서버·업체 계약 필요) */
export const ACTIVE_VERIFICATION_PROVIDER = 'mock' as const;

/** Mock 본인 인증 API가 내려주는 실명·출생 연도 */
export const MOCK_VERIFIED_IDENTITY = {
  verifiedName: '김민준',
  birthYear: 1997,
};

export const SELLER_REGION_OPTIONS: string[] = [
  '서울특별시 강남구',
  '서울특별시 마포구',
  '서울특별시 송파구',
  '경기도 성남시 분당구',
  '경기도 수원시 영통구',
  '경기도 고양시 일산동구',
  '인천광역시 연수구',
  '부산광역시 해운대구',
  '대구광역시 수성구',
  '대전광역시 서구',
];

export const PROFILE_FLOW_STEPS: { id: string; label: string }[] = [
  { id: 'verification', label: '본인 인증' },
  { id: 'profile', label: '정보 입력' },
  { id: 'application', label: '심사 신청' },
];

export const APPLICATION_RECEIVED_INFO_ITEMS = [
  {
    id: 'review',
    icon: 'search' as const,
    title: '심사 진행',
    description: '제출하신 정보와 인증 내용을 확인해요.',
  },
  {
    id: 'notify',
    icon: 'bell' as const,
    title: '결과 안내',
    description: '심사가 완료되면 앱 푸시로 바로 알려드릴게요.',
  },
  {
    id: 'duration',
    icon: 'clock' as const,
    title: '소요 기간',
    description: '보통 1~3일 정도 소요돼요.',
  },
];

export const VERIFICATION_REQUIREMENTS: VerificationRequirementItem[] = [
  {
    id: 'phone',
    title: '휴대폰 본인 인증',
    description: '본인 명의의 휴대폰으로 본인 확인을 진행해요.',
    icon: 'phone',
  },
  {
    id: 'adult',
    title: '성인 인증 (만 19세 이상)',
    description: '만 19세 이상만 판매자로 등록할 수 있어요.',
    icon: 'adult',
  },
];

export const VERIFICATION_PROGRESS_STEPS: VerificationProgressStep[] = [
  { id: 'start', label: '인증 진행', icon: 'phone' },
  { id: 'confirm', label: '정보 확인', icon: 'confirm' },
  { id: 'done', label: '인증 완료', icon: 'complete' },
];

export const VERIFICATION_INFO_NOTICES: string[] = [
  '본인 명의의 휴대폰으로만 인증할 수 있어요.',
  '인증 결과는 판매자 등록 심사에만 사용돼요.',
  '입력한 개인정보는 관련 법령에 따라 안전하게 처리돼요.',
];

export const SELLER_INTRO_HERO = {
  imageUrl:
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
  headline: '나만의 매력을 소개하고',
  headlineAccent: '새로운 만남을',
  headlineSuffix: '시작해 보세요.',
  subheadline:
    '판매자로 등록하고 전화, 커피, 식사 데이트를 제공할 수 있어요.',
};

export const SELLER_INTRO_ACTIVITIES: SellerIntroActivityItem[] = [
  {
    id: 'profile',
    title: '나만의 프로필 만들기',
    description: '사진과 자기소개, 관심사를 등록해요.',
    icon: 'profile',
  },
  {
    id: 'products',
    title: '데이트 상품 등록하기',
    description: '전화, 커피, 식사 상품을 등록해요.',
    icon: 'products',
  },
  {
    id: 'calendar',
    title: '예약 받고 데이트 진행하기',
    description: '예약 요청을 확인하고 일정을 관리해요.',
    icon: 'calendar',
  },
  {
    id: 'settlement',
    title: '수익 정산받기',
    description: '완료된 예약의 정산 내역을 확인해요.',
    icon: 'settlement',
  },
];

export const SELLER_ONBOARDING_STEPS: SellerOnboardingStep[] = [
  { id: 'info', label: '정보 입력', icon: 'info' },
  { id: 'verify', label: '본인 인증', icon: 'verify' },
  { id: 'apply', label: '심사 신청', icon: 'apply' },
  { id: 'extra', label: '추가 인증', icon: 'extra' },
  { id: 'start', label: '판매 시작', icon: 'start' },
];

export const SELLER_INTRO_NOTICES: string[] = [
  '판매자와 구매자 모두 본인 인증 및 성인 인증이 필요해요.',
  '판매자 심사 승인 후 상품 등록 및 예약 접수가 가능해요.',
  '제출한 프로필과 인증 정보가 일치해야 해요.',
  '심사 과정에서 추가 자료 또는 영상통화 인증을 요청할 수 있어요.',
  '허위 정보나 타인 명의 계정으로 신청할 수 없어요.',
];
