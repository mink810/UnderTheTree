export type SellerSlotStatus =
  | 'OPEN'
  | 'RESERVED'
  | 'CLOSED'
  | 'COMPLETED'
  | 'CANCELLED';

export type SlotRepeatRule =
  | 'NONE'
  | 'WEEKLY_SAT'
  | 'WEEKLY_SUN'
  | 'WEEKDAYS';

export interface SellerScheduleSlot {
  id: string;
  sellerId: string;
  date: string;
  startTime: string;
  endTime: string;
  productId: string;
  status: SellerSlotStatus;
  createdAt: string;
  updatedAt: string;
}

export type DayMarkerKind = 'none' | 'open' | 'mixed';
