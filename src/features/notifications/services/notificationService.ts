import { MOCK_NOTIFICATIONS } from '../data/notification.mock';
import { AppNotification } from '../types/notification.types';

let notificationsStore = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    return Promise.resolve(
      [...notificationsStore].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  },

  async getNotificationById(id: string): Promise<AppNotification | undefined> {
    return Promise.resolve(
      notificationsStore.find((item) => item.id === id)
    );
  },

  async getUnreadCount(): Promise<number> {
    return Promise.resolve(
      notificationsStore.filter((item) => !item.isRead).length
    );
  },

  async markAsRead(id: string): Promise<void> {
    notificationsStore = notificationsStore.map((item) =>
      item.id === id ? { ...item, isRead: true } : item
    );
    return Promise.resolve();
  },

  async markAllAsRead(): Promise<void> {
    notificationsStore = notificationsStore.map((item) => ({
      ...item,
      isRead: true,
    }));
    return Promise.resolve();
  },
};
