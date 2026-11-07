export type NotificationType =
  | 'BOOKING'
  | 'PAYMENT'
  | 'MESSAGE'
  | 'REVIEW'
  | 'SYSTEM';

export type NotificationTargetType =
  | 'BOOKING_DETAIL'
  | 'CHAT_ROOM'
  | 'REVIEW_WRITE'
  | 'NONE';

export type NotificationCategoryFilter =
  | 'ALL'
  | 'BOOKING_PAYMENT'
  | 'MESSAGE'
  | 'SYSTEM';

export interface NotificationMetadata {
  sellerId?: string;
  sellerNickname?: string;
  sellerAge?: number;
  sellerImageUrl?: string;
  productName?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  amount?: number;
  bookingId?: string;
  chatRoomId?: string;
  bookingStatus?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  targetType: NotificationTargetType;
  targetId?: string;
  metadata?: NotificationMetadata;
}
