import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  getDocs,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  Notification,
} from '../../types/notification.types';

type CreateNotificationParams = {

  receiverId: string;

type:
  | 'like'
  | 'comment'
  | 'follow';

  senderId: string;

  senderName: string;

  senderAvatar?: string;

  postId?: string;

  text: string;
};

export async function createNotification({

  receiverId,

  type,

  senderId,

  senderName,

  senderAvatar,

  postId,

  text,

}: CreateNotificationParams) {

  if (
    receiverId ===
    senderId
  ) {
    return;
  }

  const notificationsRef =
    collection(
      db,
      'users',
      receiverId,
      'notifications'
    );

  await addDoc(
    notificationsRef,
    {

      type,

      senderId,

      senderName,

      senderAvatar:
        senderAvatar || '',

      postId,

      text,

      read: false,

      createdAt:
        Date.now(),
    }
  );
}

export function subscribeToNotifications(
  userId: string,

  callback: (
    notifications:
      Notification[]
  ) => void
) {

  const notificationsRef =
    collection(
      db,
      'users',
      userId,
      'notifications'
    );

  const q = query(
    notificationsRef,

    orderBy(
      'createdAt',
      'desc'
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {

      const notifications =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Notification[];

      callback(
        notifications
      );
    }
  );
}

export async function markNotificationAsRead(
  userId: string,

  notificationId: string
) {

  const notificationRef =
    doc(
      db,
      'users',
      userId,
      'notifications',
      notificationId
    );

  await updateDoc(
    notificationRef,
    {
      read: true,
    }
  );
}

export async function markNotificationsAsRead(
  userId: string
) {

  const notificationsRef =
    collection(
      db,
      'users',
      userId,
      'notifications'
    );

  const snapshot =
    await getDocs(
      notificationsRef
    );

  const unreadDocs =
    snapshot.docs.filter(
      (doc) =>
        !doc.data().read
    );

  await Promise.all(
    unreadDocs.map(
      (
        notificationDoc
      ) =>
        updateDoc(
          notificationDoc.ref,
          {
            read: true,
          }
        )
    )
  );
}