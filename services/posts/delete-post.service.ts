import {
  deleteDoc,
  doc,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

export async function deletePost(
  postId: string
) {

  await deleteDoc(
    doc(
      db,
      'posts',
      postId
    )
  );
}