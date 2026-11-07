import { Review } from '../types/review.types';
import { MOCK_BUYER_ID } from '../constants/reviewTags';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_001',
    bookingId: 'bk_003',
    sellerId: '2',
    buyerId: MOCK_BUYER_ID,
    rating: 5,
    tags: ['친절해요', '대화가 즐거워요'],
    content:
      '분위기도 좋고 대화가 정말 편했어요. 다음에도 또 만나고 싶은 분이에요!',
    images: [],
    createdAt: '2026-10-16T10:00:00.000Z',
  },
  {
    id: 'rev_002',
    bookingId: 'bk_002',
    sellerId: '4',
    buyerId: MOCK_BUYER_ID,
    rating: 5,
    tags: ['친절해요', '대화가 즐거워요', '시간을 잘 지켜요'],
    content:
      '식사 데이트였는데 음식 취향도 잘 맞고 대화도 즐거웠어요. 분위기를 편하게 만들어 주셔서 좋았습니다. 다음에도 또 만나고 싶어요!',
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
    ],
    createdAt: '2026-11-09T14:20:00.000Z',
  },
  {
    id: 'rev_003',
    bookingId: 'bk_006',
    sellerId: '5',
    buyerId: MOCK_BUYER_ID,
    rating: 4,
    tags: ['편안했어요', '사진과 같아요'],
    content:
      '전반적으로 편안한 분위기였어요. 약속 시간도 잘 지켜주셔서 좋았습니다.',
    images: [],
    createdAt: '2026-10-08T09:00:00.000Z',
  },
  {
    id: 'rev_004',
    bookingId: 'bk_008',
    sellerId: '10',
    buyerId: MOCK_BUYER_ID,
    rating: 3,
    tags: ['편안했어요'],
    content:
      '무난한 시간이었어요. 대화는 편했지만 기대했던 것과는 조금 달랐습니다. 그래도 예의 바르게 대해 주셨어요.',
    images: [],
    createdAt: '2026-09-22T18:30:00.000Z',
  },
  {
    id: 'rev_005',
    bookingId: 'bk_009',
    sellerId: '12',
    buyerId: MOCK_BUYER_ID,
    rating: 5,
    tags: ['다시 만나고 싶어요', '배려심이 있어요'],
    content:
      '긴 후기 테스트입니다. 처음 만났을 때부터 배려심이 느껴졌고, 대화 주제도 자연스럽게 이어졌어요. 식사 코스마다 취향을 확인해 주셔서 편했고, 시간 가는 줄 몰랐습니다. 다음에 다른 메뉴로 또 만나보고 싶어요. 주변 친구에게도 추천할 만한 분이에요.',
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600',
    ],
    createdAt: '2026-09-12T12:00:00.000Z',
  },
];
