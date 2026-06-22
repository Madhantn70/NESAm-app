import { NotificationModel, DfcHistory } from '../../domain/models/notification.model';
import { mockNotifications, mockDfcHistory } from '../../infrastructure/mocks/notifications.mock';

interface NotificationsViewModel {
  notifications: NotificationModel[];
  dfcHistory: DfcHistory[];
}

export const useNotificationsViewModel = (): NotificationsViewModel => {
  return {
    notifications: mockNotifications,
    dfcHistory: mockDfcHistory,
  };
};
