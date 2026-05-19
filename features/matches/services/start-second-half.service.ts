import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

type Params = {

  matchId: string;

  currentMinute: number;
};

export async function startSecondHalfService({
  matchId,
  currentMinute,
}: Params) {

  const batch =
    writeBatch(
      db,
    );

  const matchRef =
    doc(
      db,
      'matches',
      matchId,
    );

  const eventsRef =
    collection(
      db,
      'matches',
      matchId,
      'events',
    );

  batch.update(
    matchRef,

    {

      status:
        'live',

      updatedAt:
        serverTimestamp(),
    },
  );

  const eventRef =
    doc(
      eventsRef,
    );

  batch.set(
    eventRef,

    {

      type:
        'second_half_started',

      minute:
        currentMinute,

      matchId,

      createdAt:
        serverTimestamp(),
    },
  );

  await batch.commit();
}