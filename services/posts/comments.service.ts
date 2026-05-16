import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  increment,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
  deleteDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  Comment,
} from '../../types/comment.types';

import {
  usePostsStore,
} from '../../store/usePostsStore';

const COMMENTS_LIMIT = 40;

// =========================
// CREATE COMMENT
// =========================
export async function createComment(
  postId: string,

  comment: Omit<
    Comment,
    'id'
  >
) {

  const commentsRef =
    collection(
      db,
      'posts',
      postId,
      'comments'
    );

  const postRef =
    doc(
      db,
      'posts',
      postId
    );

  await Promise.all([

    addDoc(
      commentsRef,
      {
        ...comment,

        createdAt:
          serverTimestamp(),
      }
    ),

    updateDoc(
      postRef,
      {
        commentsCount:
          increment(1),
      }
    ),
  ]);
}

// =========================
// DELETE COMMENT
// =========================
export async function deleteComment(
  postId: string,
  commentId: string
) {

  const commentRef =
    doc(
      db,
      'posts',
      postId,
      'comments',
      commentId
    );

  const postRef =
    doc(
      db,
      'posts',
      postId
    );

  await Promise.all([

    deleteDoc(
      commentRef
    ),

    updateDoc(
      postRef,
      {
        commentsCount:
          increment(-1),
      }
    ),
  ]);
}

// =========================
// REALTIME COMMENTS
// =========================
export function subscribeToComments(
  postId: string,

  callback: (
    comments: Comment[]
  ) => void
) {

  const commentsRef =
    collection(
      db,
      'posts',
      postId,
      'comments'
    );

  const q =
    query(

      commentsRef,

      orderBy(
        'createdAt',
        'desc'
      ),

      limit(
        COMMENTS_LIMIT
      )
    );

  const updateComments =
    usePostsStore.getState()
      .updateComments;

  return onSnapshot(

    q,

    (snapshot) => {

      const comments =
        snapshot.docs.map(
          (doc) => ({

            id:
              doc.id,

            ...doc.data(),
          })
        ) as Comment[];

      updateComments(
        postId,
        comments.length
      );

      callback(
        comments
      );
    }
  );
}