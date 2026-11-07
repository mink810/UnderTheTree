import { AvailableSlot, TimeSlotOption } from '../types/availability.types';
import {
  addMinutesToTime,
  parseTimeToMinutes,
} from './time';

const SLOT_STEP_MINUTES = 30;

function findSlotCovering(
  slots: AvailableSlot[],
  startMinutes: number
): AvailableSlot | undefined {
  return slots.find((slot) => {
    const slotStart = parseTimeToMinutes(slot.startTime);
    const slotEnd = parseTimeToMinutes(slot.endTime);
    return startMinutes >= slotStart && startMinutes < slotEnd;
  });
}

/** 상품 이용 시간 전체가 AVAILABLE 구간에 포함되는지 */
export function canBookAtStartTime(
  startTime: string,
  durationMinutes: number,
  daySlots: AvailableSlot[]
): boolean {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;

  for (
    let cursor = startMinutes;
    cursor < endMinutes;
    cursor += SLOT_STEP_MINUTES
  ) {
    const segment = findSlotCovering(daySlots, cursor);

    if (!segment || segment.status !== 'AVAILABLE') {
      return false;
    }
  }

  return true;
}

function getCandidateStartTimes(daySlots: AvailableSlot[]): string[] {
  const unique = new Set<string>();

  for (const slot of daySlots) {
    const start = parseTimeToMinutes(slot.startTime);
    const end = parseTimeToMinutes(slot.endTime);

    for (let cursor = start; cursor < end; cursor += SLOT_STEP_MINUTES) {
      unique.add(
        `${Math.floor(cursor / 60)
          .toString()
          .padStart(2, '0')}:${(cursor % 60).toString().padStart(2, '0')}`
      );
    }
  }

  return [...unique].sort(
    (a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b)
  );
}

export function buildTimeSlotOptions(
  daySlots: AvailableSlot[],
  durationMinutes: number,
  selectedStartTime: string | null
): TimeSlotOption[] {
  const candidates = getCandidateStartTimes(daySlots);

  return candidates.map((startTime) => {
    if (selectedStartTime === startTime) {
      return { startTime, displayStatus: 'SELECTED' };
    }

    const covering = findSlotCovering(
      daySlots,
      parseTimeToMinutes(startTime)
    );

    if (!covering) {
      return { startTime, displayStatus: 'UNAVAILABLE' };
    }

    if (covering.status === 'BOOKED') {
      return { startTime, displayStatus: 'BOOKED' };
    }

    if (covering.status === 'BLOCKED') {
      return { startTime, displayStatus: 'BLOCKED' };
    }

    if (!canBookAtStartTime(startTime, durationMinutes, daySlots)) {
      return { startTime, displayStatus: 'UNAVAILABLE' };
    }

    return { startTime, displayStatus: 'AVAILABLE' };
  });
}

export function dateHasBookableSlot(
  daySlots: AvailableSlot[],
  durationMinutes: number
): boolean {
  if (daySlots.length === 0) {
    return false;
  }

  const candidates = getCandidateStartTimes(daySlots);

  return candidates.some((startTime) =>
    canBookAtStartTime(startTime, durationMinutes, daySlots)
  );
}

export function getMonthMatrix(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    currentWeek.push(new Date(year, month, day));

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export function computeBookingEndTime(
  startTime: string,
  durationMinutes: number
): string {
  return addMinutesToTime(startTime, durationMinutes);
}
