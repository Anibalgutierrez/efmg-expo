import {
  useEffect,
  useState,
} from 'react';

import {
  Notification,
} from '../../../types/notification.types';

import {
  subscribeToNotifications,
} from '../../../services/notifications/notifications.service';

export default function useNotifications(
  userId?: string
) {

  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([]);

  useEffect(() => {

    if (!userId) return;

    const unsubscribe =
      subscribeToNotifications(
        userId,
        setNotifications
      );

    return () => {

      if (
        unsubscribe
      ) {
        unsubscribe();
      }
    };

  }, [userId]);

  const unreadCount =
    notifications.filter(
      (
        notification
      ) => !notification.read
    ).length;

  return {
    notifications,
    unreadCount,
  };
}