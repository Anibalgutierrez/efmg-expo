import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

type UserData = {
  name: string;
  avatar: string;
  bio?: string;
};

export async function syncUserData(
  userId: string,
  userData: UserData
) {

  // =========================
  // POSTS
  // =========================
  const postsQuery = query(
    collection(
      db,
      'posts'
    ),
    where(
      'user.id',
      '==',
      userId
    )
  );

  const postsSnapshot =
    await getDocs(
      postsQuery
    );

  const postUpdates =
    postsSnapshot.docs.map(
      (postDoc) =>

        updateDoc(
          doc(
            db,
            'posts',
            postDoc.id
          ),
          {
            user: {
              ...postDoc.data().user,
              ...userData,
            },
          }
        )
    );


  await Promise.all(
    postUpdates
  );

  // =========================
  // COMMENTS
  // =========================
  for (
    const postDoc of
    postsSnapshot.docs
  ) {

    const commentsSnapshot =
      await getDocs(
        collection(
          db,
          'posts',
          postDoc.id,
          'comments'
        )
      );

    const commentUpdates =
      commentsSnapshot.docs
        .filter(
          (commentDoc) =>

            commentDoc.data()
              .user?.id ===
            userId
        )
        .map(
          (commentDoc) =>

            updateDoc(
              doc(
                db,
                'posts',
                postDoc.id,
                'comments',
                commentDoc.id
              ),
              {
                user: {
                  ...commentDoc.data().user,
                  ...userData,
                },
              }
            )
        );

    await Promise.all(
      commentUpdates
    );
  }
}