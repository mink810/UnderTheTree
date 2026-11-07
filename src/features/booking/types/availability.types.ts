export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

export interface AvailableSlot {
  id: string;
  sellerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

export interface BookingSelection {
  sellerId: string;
  productId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  price: number;
}

/** 시간 슬롯 UI 표시용 */
export type TimeSlotDisplayStatus =
  | 'AVAILABLE'
  | 'SELECTED'
  | 'BOOKED'
  | 'BLOCKED'
  | 'UNAVAILABLE';

export interface TimeSlotOption {
  startTime: string;
  displayStatus: TimeSlotDisplayStatus;
}
