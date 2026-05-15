import {
  doc,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

type UpdateUserParams = {

  userId: string;

  data: {

    name?: string;

    bio?: string;

    avatar?: string;
  };
};

export async function updateUser({

  userId,
  data,

}: UpdateUserParams) {

  const userRef =
    doc(
      db,
      'users',
      userId
    );

  await updateDoc(
    userRef,
    data
  );
}