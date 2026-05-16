import {
  doc,
  collection,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

const MAX_BATCH_SIZE = 450;

export async function deletePost(
  postId: string
) {

  // =========================
  // REFS
  // =========================
  const commentsRef =
    collection(
      db,
      'posts',
      postId,
      'comments'
    );

  const likesRef =
    collection(
      db,
      'posts',
      postId,
      'likes'
    );

  // =========================
  // LOAD PARALLEL
  // =========================
  const [

    commentsSnapshot,

    likesSnapshot,

  ] = await Promise.all([

    getDocs(
      commentsRef
    ),

    getDocs(
      likesRef
    ),
  ]);

  // =========================
  // ALL DOCS
  // =========================
  const docsToDelete = [

    ...commentsSnapshot.docs,

    ...likesSnapshot.docs,
  ];

  // =========================
  // SAFETY LIMIT
  // =========================
  if (
    docsToDelete.length >
    MAX_BATCH_SIZE
  ) {

    throw new Error(
      'Post demasiado grande para eliminar en un batch.'
    );
  }

  // =========================
  // BATCH
  // =========================
  const batch =
    writeBatch(db);

  docsToDelete.forEach(
    (docItem) => {

      batch.delete(
        docItem.ref
      );
    }
  );

  // =========================
  // DELETE POST
  // =========================
  const postRef =
    doc(
      db,
      'posts',
      postId
    );

  batch.delete(
    postRef
  );

  // =========================
  // COMMIT
  // =========================
  await batch.commit();
}