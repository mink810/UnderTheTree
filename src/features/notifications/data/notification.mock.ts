import { AppNotification } from '../types/notification.types';

const now = new Date();

function hoursAgo(hours: number): string {
  const date = new Date(now);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function daysAgo(days: number, hour = 12): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 30, 0, 0);
  return date.toISOString();
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf_001',
    type: 'MESSAGE',
    title: '민수님이 메시지를 보냈어요',
    message: '만나는 장소를 조금만 바꿔도 될까요?',
    createdAt: hoursAgo(0.5),
    isRead: false,
    targetType: 'CHAT_ROOM',
    targetId: 'bk_001',
    metadata: {
      sellerNickname: '민수',
      sellerAge: 29,
      sellerImageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      bookingId: 'bk_001',
      chatRoomId: 'bk_001',
    },
  },
  {
    id: 'ntf_002',
    type: 'BOOKING',
    title: '예약이 확정되었어요!',
    message: '민수님과의 커피데이트 예약이 확정되었어요.',
    createdAt: hoursAgo(2),
    isRead: false,
    targetType: 'BOOKING_DETAIL',
    targetId: 'bk_001',
    metadata: {
      sellerId: '1',
      sellerNickname: '도윤',
      sellerAge: 27,
      productName: '커피데이트',
      bookingDate: '2026-11-08',
      startTime: '12:00',
      endTime: '13:00',
      amount: 50000,
      bookingId: 'bk_001',
      bookingStatus: '예약 확정',
    },
  },
  {
    id: 'ntf_003',
    type: 'PAYMENT',
    title: '결제가 완료되었어요',
    message: '커피데이트 예약 결제 50,000원이 정상 처리되었어요.',
    createdAt: hoursAgo(3),
    isRead: false,
    targetType: 'BOOKING_DETAIL',
    targetId: 'bk_001',
    metadata: {
      productName: '커피데이트',
      bookingDate: '2026-11-08',
      startTime: '12:00',
      endTime: '13:00',
      amount: 50000,
      bookingId: 'bk_001',
    },
  },
  {
    id: 'ntf_004',
    type: 'REVIEW',
    title: '후기를 작성해 주세요',
    message: '지훈님과의 식사데이트는 어떠셨나요?',
    createdAt: hoursAgo(5),
    isRead: true,
    targetType: 'REVIEW_WRITE',
    targetId: 'bk_002',
    metadata: {
      sellerNickname: '지훈',
      sellerAge: 31,
      productName: '식사데이트',
      bookingDate: '2026-10-20',
      bookingId: 'bk_002',
    },
  },
  {
    id: 'ntf_005',
    type: 'MESSAGE',
    title: '서준님이 메시지를 보냈어요',
    message: '내일 만나서 반가워요! 편한 복장으로 와주세요.',
    createdAt: hoursAgo(8),
    isRead: true,
    targetType: 'CHAT_ROOM',
    targetId: 'bk_004',
    metadata: {
      sellerNickname: '서준',
      sellerAge: 29,
      sellerImageUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      bookingId: 'bk_004',
      chatRoomId: 'bk_004',
    },
  },
  {
    id: 'ntf_006',
    type: 'PAYMENT',
    title: '환불이 완료되었어요',
    message: '취소하신 예약의 환불 50,000원이 처리되었어요.',
    createdAt: daysAgo(1, 9),
    isRead: false,
    targetType: 'BOOKING_DETAIL',
    targetId: 'bk_006',
    metadata: {
      productName: '커피데이트',
      amount: 50000,
      bookingId: 'bk_006',
      bookingStatus: '환불 완료',
    },
  },
  {
    id: 'ntf_007',
    type: 'BOOKING',
    title: '예약 일정이 변경되었어요',
    message: '민재님과의 식사데이트 시간이 18:30으로 변경되었어요.',
    createdAt: daysAgo(1, 15),
    isRead: true,
    targetType: 'BOOKING_DETAIL',
    targetId: 'bk_004',
    metadata: {
      sellerNickname: '민재',
      sellerAge: 26,
      productName: '식사데이트',
      bookingDate: '2026-11-12',
      startTime: '18:30',
      endTime: '20:00',
      bookingId: 'bk_004',
    },
  },
  {
    id: 'ntf_008',
    type: 'SYSTEM',
    title: '겨울 시즌 이벤트 안내',
    message: '12월 한정, 첫 예약 시 수수료 할인 이벤트를 확인해 보세요.',
    createdAt: daysAgo(1, 20),
    isRead: true,
    targetType: 'NONE',
  },
  {
    id: 'ntf_009',
    type: 'SYSTEM',
    title: '서비스 점검 안내',
    message: '11월 5일 새벽 2시~4시 서비스 점검이 예정되어 있어요.',
    createdAt: daysAgo(2, 10),
    isRead: true,
    targetType: 'NONE',
  },
  {
    id: 'ntf_010',
    type: 'REVIEW',
    title: '후기 작성 기한이 얼마 남지 않았어요',
    message: '완료된 데이트 후기를 남기고 다른 구매자에게 도움을 주세요.',
    createdAt: daysAgo(3, 11),
    isRead: true,
    targetType: 'REVIEW_WRITE',
    targetId: 'bk_002',
    metadata: {
      bookingId: 'bk_002',
      productName: '식사데이트',
    },
  },
  {
    id: 'ntf_011',
    type: 'BOOKING',
    title: '내일 예약이 있어요',
    message: '도윤님과의 커피데이트가 내일 12:00에 예정되어 있어요.',
    createdAt: daysAgo(4, 8),
    isRead: true,
    targetType: 'BOOKING_DETAIL',
    targetId: 'bk_001',
    metadata: {
      sellerNickname: '도윤',
      productName: '커피데이트',
      bookingDate: '2026-11-08',
      startTime: '12:00',
      endTime: '13:00',
      bookingId: 'bk_001',
    },
  },
  {
    id: 'ntf_012',
    type: 'PAYMENT',
    title: '결제 실패 안내',
    message: '카드 승인이 되지 않았어요. 다시 시도해 주세요.',
    createdAt: daysAgo(5, 14),
    isRead: true,
    targetType: 'NONE',
  },
];
