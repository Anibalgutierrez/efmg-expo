import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../../firebase/config';

import {
  increment,
  updateDoc,
  doc,
} from 'firebase/firestore';

import { Comment }
from '../../types/comment.types';

export async function createComment(
  postId: string,
  comment: Comment
) {
  const commentsRef = collection(
    db,
    'posts',
    postId,
    'comments'
  );

  const postRef = doc(
    db,
    'posts',
    postId
  );

  await addDoc(
    commentsRef,
    comment
  );

  await updateDoc(postRef, {
    commentsCount:
      increment(1),
  });
}

export function subscribeToComments(
  postId: string,
  callback: (comments: Comment[]) => void
) {
  const commentsRef = collection(
    db,
    'posts',
    postId,
    'comments'
  );

  const q = query(
    commentsRef,
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
   const comments: Comment[] =
  snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];

    callback(comments);
  });
}