import {
  doc,
  setDoc,
  deleteDoc,
  increment,
  updateDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

export async function followUser(

  currentUserId: string,
  targetUserId: string

) {

  const followingRef =
    doc(
      db,
      'users',
      currentUserId,
      'following',
      targetUserId
    );

  const followerRef =
    doc(
      db,
      'users',
      targetUserId,
      'followers',
      currentUserId
    );

  await setDoc(
    followingRef,
    {
      createdAt:
        serverTimestamp(),
    }
  );

  await setDoc(
    followerRef,
    {
      createdAt:
        serverTimestamp(),
    }
  );

  await updateDoc(
    doc(
      db,
      'users',
      currentUserId
    ),
    {
      followingCount:
        increment(1),
    }
  );

  await updateDoc(
    doc(
      db,
      'users',
      targetUserId
    ),
    {
      followersCount:
        increment(1),
    }
  );
}

export async function unfollowUser(

  currentUserId: string,
  targetUserId: string

) {

  const followingRef =
    doc(
      db,
      'users',
      currentUserId,
      'following',
      targetUserId
    );

  const followerRef =
    doc(
      db,
      'users',
      targetUserId,
      'followers',
      currentUserId
    );

  await deleteDoc(
    followingRef
  );

  await deleteDoc(
    followerRef
  );

  await updateDoc(
    doc(
      db,
      'users',
      currentUserId
    ),
    {
      followingCount:
        increment(-1),
    }
  );

  await updateDoc(
    doc(
      db,
      'users',
      targetUserId
    ),
    {
      followersCount:
        increment(-1),
    }
  );
}

export async function checkIfFollowing(

  currentUserId: string,
  targetUserId: string

) {

  const followingRef =
    doc(
      db,
      'users',
      currentUserId,
      'following',
      targetUserId
    );

  const snapshot =
    await getDoc(
      followingRef
    );

  return snapshot.exists();
}

export function subscribeToFollowStatus(

  currentUserId: string,
  targetUserId: string,

  callback: (
    following: boolean
  ) => void

) {

  const followingRef =
    doc(
      db,
      'users',
      currentUserId,
      'following',
      targetUserId
    );

  return onSnapshot(
    followingRef,
    (snapshot) => {

      callback(
        snapshot.exists()
      );
    }
  );
}