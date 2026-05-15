import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { db }
from '../../firebase/config';

import { Post }
from '../../types/post.types';

export function subscribeToUserPosts(
  userId: string,
  callback: (posts: Post[]) => void
) {
  const postsRef =
    collection(db, 'posts');

  const q = query(
    postsRef,

    where(
      'user.id',
      '==',
      userId
    ),

    orderBy(
      'createdAt',
      'desc'
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const posts: Post[] =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];

      callback(posts);
    }
  );
}