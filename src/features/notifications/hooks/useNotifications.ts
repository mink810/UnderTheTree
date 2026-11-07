import { useCallback, useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { AppNotification } from '../types/notification.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [list, count] = await Promise.all([
      notificationService.getNotifications(),
      notificationService.getUnreadCount(),
    ]);
    setNotifications(list);
    setUnreadCount(count);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    await refresh();
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    loading,
    refresh,
    markAllRead,
  };
}
