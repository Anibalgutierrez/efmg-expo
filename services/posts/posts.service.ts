import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  Post,
} from '../../types/post.types';

const postsRef =
  collection(
    db,
    'posts'
  );

export async function createPost(
  post: Omit<Post, 'id'>
) {

  await addDoc(
    postsRef,
    post
  );
}

export function subscribeToPosts(
  callback: (
    posts: Post[]
  ) => void
) {

  const q = query(

    postsRef,

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

export async function getPost(
  postId: string
) {

  const postRef = doc(
    db,
    'posts',
    postId
  );

  const snapshot =
    await getDoc(
      postRef
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  return {

    id: snapshot.id,

    ...snapshot.data(),

  } as Post;
}