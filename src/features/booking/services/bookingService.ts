import { MOCK_BOOKINGS } from '../data/booking.mock';
import { Booking, BookingStatus } from '../types/booking.types';

let bookingsStore = [...MOCK_BOOKINGS];

export const bookingService = {
  async getBookings(): Promise<Booking[]> {
    return Promise.resolve([...bookingsStore]);
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    return Promise.resolve(bookingsStore.find((item) => item.id === id));
  },

  async requestCancel(bookingId: string): Promise<Booking | undefined> {
    const index = bookingsStore.findIndex((item) => item.id === bookingId);

    if (index < 0) {
      return undefined;
    }

    const updated: Booking = {
      ...bookingsStore[index],
      status: 'CANCEL_REQUESTED',
    };

    bookingsStore[index] = updated;
    return Promise.resolve(updated);
  },

  async updateStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<Booking | undefined> {
    const index = bookingsStore.findIndex((item) => item.id === bookingId);

    if (index < 0) {
      return undefined;
    }

    bookingsStore[index] = { ...bookingsStore[index], status };
    return Promise.resolve(bookingsStore[index]);
  },

  async markReviewWritten(
    bookingId: string,
    reviewWritten: boolean
  ): Promise<Booking | undefined> {
    const index = bookingsStore.findIndex((item) => item.id === bookingId);

    if (index < 0) {
      return undefined;
    }

    bookingsStore[index] = {
      ...bookingsStore[index],
      reviewWritten,
    };

    return Promise.resolve(bookingsStore[index]);
  },
};
