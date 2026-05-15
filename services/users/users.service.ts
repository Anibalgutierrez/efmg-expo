import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db }
from '../../firebase/config';

import { User }
from '../../types/user.types';

export async function createUser(
  userId: string,
  user: User
) {
  await setDoc(
    doc(
      db,
      'users',
      userId
    ),
    user
  );
}

export async function getUser(
  userId: string
): Promise<User | null> {

  const docRef = doc(
    db,
    'users',
    userId
  );

  const snapshot =
    await getDoc(docRef);

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  return {
  id: snapshot.id,
  ...snapshot.data(),
} as User;
}

export async function updateUser(
  userId: string,
  data: Partial<User>
) {
  const userRef = doc(
    db,
    'users',
    userId
  );

  await updateDoc(
    userRef,
    data
  );
}