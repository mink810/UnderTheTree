import { SellerProfile } from '../types/seller-profile.types';

const COMMON_REVIEWS = [
  {
    id: 'r1',
    reviewerNickname: '소소한하루',
    rating: 5,
    content: '대화도 편안하고 즐거운 시간이었어요!',
    createdAt: '2026-10-28',
  },
  {
    id: 'r2',
    reviewerNickname: '오늘도행복',
    rating: 5,
    content: '시간 가는 줄 모르고 이야기했어요.',
    createdAt: '2026-10-25',
  },
  {
    id: 'r3',
    reviewerNickname: '구름산책',
    rating: 4,
    content: '친절하고 배려심이 느껴졌어요.',
    createdAt: '2026-10-20',
  },
];

const PROFILES: Record<
  string,
  Omit<SellerProfile, 'sellerId' | 'products' | 'rating' | 'reviewCount'>
> = {
  '1': {
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900',
    ],
    height: 178,
    introduction:
      '안녕하세요! 여행과 운동을 좋아하고 새로운 사람과 이야기 나누는 걸 즐깁니다. 편안하고 즐거운 시간을 함께 보내요.',
    personalityTags: ['다정함', '유머러스', '외향적', '대화 좋아함'],
    hashtags: ['테토남', '연하남', '모델', '운동'],
    interests: ['카페', '여행', '운동'],
    favoriteThings: '커피, 여행, 새로운 맛집 찾아다니기',
    thingsDisliked: '약속을 가볍게 생각하는 것',
    dateStyle: '서로의 이야기를 듣고 자연스럽게 웃을 수 있는 데이트',
    idealDate: '분위기 좋은 카페에서 이야기하다가 맛있는 저녁 먹기',
    snsLinks: {
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
    },
    verification: {
      identityVerified: true,
      adultVerified: true,
      sellerApproved: true,
    },
    reviews: COMMON_REVIEWS,
  },

  '2': {
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900',
    ],
    height: 181,
    introduction:
      '차분한 성격이지만 친해지면 장난도 많이 쳐요. 맛있는 음식과 여행을 좋아합니다.',
    personalityTags: ['차분함', '배려심', '유머러스'],
    hashtags: ['훈훈한남자', '여행', '맛집'],
    interests: ['맛집', '여행', '영화'],
    favoriteThings: '맛있는 음식과 새로운 장소',
    thingsDisliked: '무례한 행동',
    dateStyle: '상대방의 취향에 맞춰 함께 즐기는 데이트',
    idealDate: '맛집에서 식사하고 근처 산책하기',
    snsLinks: {},
    verification: {
      identityVerified: true,
      adultVerified: true,
      sellerApproved: true,
    },
    reviews: COMMON_REVIEWS,
  },

  '3': {
    photos: [
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=900',
    ],
    height: 176,
    introduction:
      '밝고 긍정적인 에너지를 좋아합니다. 음악과 카페를 즐기고 편하게 대화하는 걸 좋아해요.',
    personalityTags: ['밝음', '친근함', '긍정적'],
    hashtags: ['카페투어', '음악', '일상'],
    interests: ['카페', '음악', '사진'],
    favoriteThings: '아메리카노와 재즈 음악',
    thingsDisliked: '지나치게 시끄러운 장소',
    dateStyle: '여유롭게 대화하며 서로 알아가는 데이트',
    idealDate: '예쁜 카페에서 커피 마시고 사진 찍기',
    snsLinks: {},
    verification: {
      identityVerified: true,
      adultVerified: true,
      sellerApproved: true,
    },
    reviews: COMMON_REVIEWS,
  },

  '4': {
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900',
    ],
    height: 183,
    introduction:
      '운동과 자기관리를 좋아하는 사람입니다. 진솔하고 즐거운 대화를 나누고 싶어요.',
    personalityTags: ['성실함', '자기관리', '다정함'],
    hashtags: ['운동', '직장인', '자기관리'],
    interests: ['헬스', '골프', '여행'],
    favoriteThings: '운동 후 맛있는 식사',
    thingsDisliked: '거짓말',
    dateStyle: '활동적인 데이트와 편안한 대화를 모두 좋아해요.',
    idealDate: '맛있는 식사 후 야경 보며 산책하기',
    snsLinks: {},
    verification: {
      identityVerified: true,
      adultVerified: true,
      sellerApproved: true,
    },
    reviews: COMMON_REVIEWS,
  },
};

const DEFAULT_PROFILE = {
  photos: [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
  ],
  introduction:
    '안녕하세요! 새로운 사람과 대화하고 즐거운 시간을 보내는 것을 좋아합니다.',
  personalityTags: ['다정함', '친근함', '긍정적'],
  hashtags: ['일상', '데이트', '소통'],
  interests: ['카페', '여행', '음악'],
  favoriteThings: '커피와 여행',
  thingsDisliked: '',
  dateStyle: '서로의 이야기를 나누며 편안하게 보내는 데이트',
  idealDate: '분위기 좋은 곳에서 맛있는 음식과 대화 즐기기',
  snsLinks: {},
  verification: {
    identityVerified: true,
    adultVerified: true,
    sellerApproved: true,
  },
  reviews: COMMON_REVIEWS,
};

export function getMockProfileData(sellerId: string) {
  return PROFILES[sellerId] ?? DEFAULT_PROFILE;
}
