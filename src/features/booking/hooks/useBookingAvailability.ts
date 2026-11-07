import { useCallback, useEffect, useMemo, useState } from 'react';
import { availabilityService } from '../services/availabilityService';
import { AvailableSlot } from '../types/availability.types';
import {
  buildTimeSlotOptions,
  dateHasBookableSlot,
} from '../utils/availabilityRules';
import { formatDateKey, startOfDay } from '../utils/time';

export function useBookingAvailability(
  sellerId: string | undefined,
  durationMinutes: number
) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!sellerId) {
      setSlots([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    availabilityService
      .getSlotsBySellerId(sellerId)
      .then((data) => {
        if (mounted) {
          setSlots(data);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [sellerId]);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, AvailableSlot[]>();

    for (const slot of slots) {
      const list = map.get(slot.date) ?? [];
      list.push(slot);
      map.set(slot.date, list);
    }

    return map;
  }, [slots]);

  const isDateSelectable = useCallback(
    (date: Date): boolean => {
      const today = startOfDay(new Date());

      if (date < today) {
        return false;
      }

      const dateKey = formatDateKey(date);
      const daySlots = slotsByDate.get(dateKey) ?? [];

      return dateHasBookableSlot(daySlots, durationMinutes);
    },
    [slotsByDate, durationMinutes]
  );

  const getTimeOptions = useCallback(
    (dateKey: string | null, selectedStartTime: string | null) => {
      if (!dateKey) {
        return [];
      }

      const daySlots = slotsByDate.get(dateKey) ?? [];
      return buildTimeSlotOptions(
        daySlots,
        durationMinutes,
        selectedStartTime
      );
    },
    [slotsByDate, durationMinutes]
  );

  return {
    loading,
    isDateSelectable,
    getTimeOptions,
  };
}
