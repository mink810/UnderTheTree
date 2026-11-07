import { MOCK_SELLERS } from '../../seller/data/seller.mock';
import { AvailableSlot, SlotStatus } from '../types/availability.types';
import { addDays, formatDateKey, pad2 } from '../utils/time';

const HORIZON_DAYS = 30;
const WORK_START_HOUR = 10;
const WORK_END_HOUR = 19;

function buildDaySlots(
  sellerId: string,
  dateKey: string,
  dayIndex: number
): AvailableSlot[] {
  const date = dateKey;
  const slots: AvailableSlot[] = [];

  for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour += 1) {
    for (const minute of [0, 30]) {
      const startTime = `${pad2(hour)}:${pad2(minute)}`;
      const endMinutes = hour * 60 + minute + 30;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${pad2(endHour)}:${pad2(endMin)}`;

      let status: SlotStatus = 'AVAILABLE';

      // 일요일 휴무
      const weekday = new Date(
        Number(dateKey.slice(0, 4)),
        Number(dateKey.slice(5, 7)) - 1,
        Number(dateKey.slice(8, 10))
      ).getDay();

      if (weekday === 0) {
        status = 'BLOCKED';
      }

      // 데모: 8일째 날 15:00 예약 완료
      if (dayIndex === 7 && startTime === '15:00') {
        status = 'BOOKED';
      }

      // 데모: 3일째 날 오후 일부 차단
      if (dayIndex === 2 && startTime >= '14:00' && startTime < '16:00') {
        status = 'BLOCKED';
      }

      // 랜덤 예약 완료 (판매자별 고정 패턴)
      const sellerNum = Number(sellerId) || 0;
      if (
        status === 'AVAILABLE' &&
        (hour + sellerNum + dayIndex) % 11 === 0 &&
        minute === 0
      ) {
        status = 'BOOKED';
      }

      slots.push({
        id: `${sellerId}-${date}-${startTime}`,
        sellerId,
        date,
        startTime,
        endTime,
        status,
      });
    }
  }

  return slots;
}

function generateSellerSlots(sellerId: string): AvailableSlot[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const all: AvailableSlot[] = [];

  for (let dayIndex = 0; dayIndex < HORIZON_DAYS; dayIndex += 1) {
    const date = addDays(today, dayIndex);
    const dateKey = formatDateKey(date);
    all.push(...buildDaySlots(sellerId, dateKey, dayIndex));
  }

  return all;
}

const cache = new Map<string, AvailableSlot[]>();

export function getMockSlotsForSeller(sellerId: string): AvailableSlot[] {
  if (!cache.has(sellerId)) {
    cache.set(sellerId, generateSellerSlots(sellerId));
  }

  return cache.get(sellerId)!;
}

export function getAllMockAvailability(): AvailableSlot[] {
  return MOCK_SELLERS.flatMap((seller) => getMockSlotsForSeller(seller.id));
}
