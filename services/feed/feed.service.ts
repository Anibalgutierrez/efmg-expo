import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

import { db }
from '../../firebase/config';

import { Post }
from '../../types/post.types';

export async function subscribeToFeed(
  userId: string,
  callback: (posts: Post[]) => void
) {
  const followingRef =
    collection(
      db,
      'users',
      userId,
      'following'
    );

  const followingSnapshot =
    await getDocs(
      followingRef
    );

  const followingIds =
    followingSnapshot.docs.map(
      (doc) => doc.id
    );

  const feedIds = [
    userId,
    ...followingIds,
  ];

  const postsRef =
    collection(db, 'posts');

  const q = query(
    postsRef,

    where(
      'user.id',
      'in',
      feedIds
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
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Post[];

      callback(posts);
    }
  );
}