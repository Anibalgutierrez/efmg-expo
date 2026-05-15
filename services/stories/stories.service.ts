import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  Story,
} from '../../types/story.types';

export async function createStory(
  story: Omit<
    Story,
    'id'
  >
) {

  const storiesRef =
    collection(
      db,
      'stories'
    );

  await addDoc(
    storiesRef,
    story
  );
}

export function subscribeToStories(
  callback: (
    stories: Story[]
  ) => void
) {

  const now =
    Timestamp.now();

  const storiesRef =
    collection(
      db,
      'stories'
    );

  const q = query(
    storiesRef,

    orderBy(
      'createdAt',
      'desc'
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {

      const stories =
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (story: any) =>
              story.expiresAt?.seconds >
              now.seconds
          ) as Story[];

      callback(
        stories
      );
    }
  );
}

export function getStoryExpiration() {

  return Timestamp.fromDate(
    new Date(
      Date.now() +
      24 *
      60 *
      60 *
      1000
    )
  );
}