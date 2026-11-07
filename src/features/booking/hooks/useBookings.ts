import { useCallback, useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/booking.types';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);

    return bookingService.getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { bookings, loading, refresh };
}
