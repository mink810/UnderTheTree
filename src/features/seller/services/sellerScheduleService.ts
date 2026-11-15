import AsyncStorage from '@react-native-async-storage/async-storage';

import { SELLER_CATALOG_OWNER_ID } from './sellerProductCatalogService';
import { SellerScheduleSlot, SellerSlotStatus } from '../types/seller-schedule.types';
import { rangesOverlap } from '../utils/sellerScheduleTime';

const STORAGE_KEY = '@my-date-app/seller/schedule-slots';

function nowIso() {
  return new Date().toISOString();
}

async function readAll(): Promise<SellerScheduleSlot[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as SellerScheduleSlot[];
  } catch {
    return [];
  }
}

async function writeAll(slots: SellerScheduleSlot[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
}

export const sellerScheduleService = {
  sellerId: SELLER_CATALOG_OWNER_ID,

  async listSlots(sellerId = SELLER_CATALOG_OWNER_ID): Promise<SellerScheduleSlot[]> {
    const all = await readAll();
    return all.filter((s) => s.sellerId === sellerId);
  },

  async listByDate(
    dateKey: string,
    sellerId = SELLER_CATALOG_OWNER_ID
  ): Promise<SellerScheduleSlot[]> {
    const all = await this.listSlots(sellerId);
    return all
      .filter((s) => s.date === dateKey)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  },

  async openSlot(input: {
    date: string;
    startTime: string;
    endTime: string;
    productId: string;
  }): Promise<SellerScheduleSlot> {
    const all = await readAll();
    const sameDay = all.filter(
      (s) => s.sellerId === SELLER_CATALOG_OWNER_ID && s.date === input.date
    );
    const overlap = sameDay.some((s) =>
      rangesOverlap(s.startTime, s.endTime, input.startTime, input.endTime)
    );
    if (overlap) {
      throw new Error('DUPLICATE_SLOT');
    }

    const timestamp = nowIso();
    const slot: SellerScheduleSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sellerId: SELLER_CATALOG_OWNER_ID,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      productId: input.productId,
      status: 'OPEN',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await writeAll([...all, slot]);
    return slot;
  },

  async updateOpenSlot(
    slotId: string,
    patch: { startTime: string; endTime: string; productId: string }
  ): Promise<void> {
    const all = await readAll();
    const index = all.findIndex((s) => s.id === slotId);
    if (index < 0) {
      throw new Error('NOT_FOUND');
    }
    const slot = all[index];
    if (slot.status !== 'OPEN') {
      throw new Error('NOT_EDITABLE');
    }
    const sameDay = all.filter(
      (s) =>
        s.sellerId === slot.sellerId &&
        s.date === slot.date &&
        s.id !== slotId
    );
    if (
      sameDay.some((s) =>
        rangesOverlap(s.startTime, s.endTime, patch.startTime, patch.endTime)
      )
    ) {
      throw new Error('DUPLICATE_SLOT');
    }
    const next = [...all];
    next[index] = {
      ...slot,
      ...patch,
      updatedAt: nowIso(),
    };
    await writeAll(next);
  },

  async setSlotStatus(slotId: string, status: SellerSlotStatus): Promise<void> {
    const all = await readAll();
    const index = all.findIndex((s) => s.id === slotId);
    if (index < 0) {
      throw new Error('NOT_FOUND');
    }
    const slot = all[index];
    if (
      status === 'OPEN' &&
      (slot.status === 'RESERVED' || slot.status === 'COMPLETED')
    ) {
      throw new Error('NOT_EDITABLE');
    }
    const next = [...all];
    next[index] = { ...slot, status, updatedAt: nowIso() };
    await writeAll(next);
  },

  async deleteSlot(slotId: string): Promise<void> {
    const all = await readAll();
    const slot = all.find((s) => s.id === slotId);
    if (!slot) {
      throw new Error('NOT_FOUND');
    }
    if (slot.status === 'RESERVED') {
      throw new Error('NOT_DELETABLE');
    }
    await writeAll(all.filter((s) => s.id !== slotId));
  },

  async closeAllOpenOnDate(dateKey: string): Promise<number> {
    const all = await readAll();
    let count = 0;
    const next = all.map((s) => {
      if (
        s.sellerId === SELLER_CATALOG_OWNER_ID &&
        s.date === dateKey &&
        s.status === 'OPEN'
      ) {
        count += 1;
        return { ...s, status: 'CLOSED' as const, updatedAt: nowIso() };
      }
      return s;
    });
    await writeAll(next);
    return count;
  },
};
