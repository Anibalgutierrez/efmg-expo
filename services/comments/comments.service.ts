import {
  addDoc,
  collection,
  increment,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  User,
} from '../../types/user.types';

import {
  Comment,
} from '../../types/comment.types';

import {
  createNotification,
} from '../notifications/notifications.service';

export async function createComment(
  postId: string,

  postOwnerId: string,

  currentUser: User,

  text: string
) {

  const commentsRef =
    collection(
      db,
      'posts',
      postId,
      'comments'
    );

  const comment: Omit<
    Comment,
    'id'
  > = {
    text,

    createdAt:
      serverTimestamp(),

    user: currentUser,
  };

  await addDoc(
    commentsRef,
    comment
  );

  const postRef = doc(
    db,
    'posts',
    postId
  );

  await updateDoc(
    postRef,
    {
      commentsCount:
        increment(1),
    }
  );

 if (
  postOwnerId !==
  currentUser.id
) {

  await createNotification({

    receiverId:
      postOwnerId,

    type: 'comment',

    senderId:
      currentUser.id,

    senderName:
      currentUser.name,

    senderAvatar:
      currentUser.avatar,

    postId,

    text:
      'comentó tu publicación',
  });
}
}