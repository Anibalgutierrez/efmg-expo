import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

export async function likePost(
  postId: string,
  userId: string
) {

  const likeRef = doc(
    db,
    'posts',
    postId,
    'likes',
    userId
  );

  await setDoc(
    likeRef,
    {
      userId,

      createdAt:
        serverTimestamp(),
    }
  );
}

export async function unlikePost(
  postId: string,
  userId: string
) {

  const likeRef = doc(
    db,
    'posts',
    postId,
    'likes',
    userId
  );

  await deleteDoc(
    likeRef
  );
}

export function subscribeToLikes(

  postId: string,

  callback: (
    likes: number,
    liked: boolean
  ) => void,

  userId?: string

) {

  const likesRef =
    collection(
      db,
      'posts',
      postId,
      'likes'
    );

  const q =
    query(likesRef);

  return onSnapshot(
    q,
    (snapshot) => {

      const likes =
        snapshot.size;

      const liked =
        snapshot.docs.some(
          (doc) =>
            doc.id ===
            userId
        );

      callback(
        likes,
        liked
      );
    }
  );
}