import { getMockSlotsForSeller } from '../data/availableSlot.mock';
import { AvailableSlot } from '../types/availability.types';

export const availabilityService = {
  async getSlotsBySellerId(sellerId: string): Promise<AvailableSlot[]> {
    return Promise.resolve(getMockSlotsForSeller(sellerId));
  },

  async getSlotsBySellerAndDate(
    sellerId: string,
    date: string
  ): Promise<AvailableSlot[]> {
    const slots = getMockSlotsForSeller(sellerId);
    return Promise.resolve(slots.filter((slot) => slot.date === date));
  },
};
