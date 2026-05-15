import {
  useEffect,
  useState,
} from 'react';

import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

export default function useUnreadNotifications(
  userId?: string
) {

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  useEffect(() => {

    if (!userId) return;

    const notificationsRef =
      collection(
        db,
        'users',
        userId,
        'notifications'
      );

    const q = query(
      notificationsRef,

      where(
        'read',
        '==',
        false
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          setUnreadCount(
            snapshot.size
          );
        }
      );

    return unsubscribe;

  }, [userId]);

  return unreadCount;
}