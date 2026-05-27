import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  Post,
} from '../../features/posts/types/post.types';

const FEED_LIMIT = 20;

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

  // =========================
  // FIRESTORE LIMIT:
  // MAX 10 ITEMS IN "in"
  // =========================
  const feedIds = [

    userId,

    ...followingIds,

  ].slice(0, 10);

  // =========================
  // SAFETY
  // =========================
  if (
    feedIds.length === 0
  ) {

    callback([]);

    return () => {};
  }

  const postsRef =
    collection(
      db,
      'posts'
    );

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
    ),

    limit(
      FEED_LIMIT
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

      callback(
        posts
      );
    }
  );
}