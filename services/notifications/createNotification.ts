import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

type Params = {

  receiverId: string;

  type:
    | 'like'
    | 'comment'
    | 'follow'
    | 'match';

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

}: Params) {

  if (
    receiverId === senderId
  ) {
    return;
  }

  await addDoc(

    collection(
      db,
      'users',
      receiverId,
      'notifications',
    ),

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
        serverTimestamp(),
    },
  );
}