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

export async function halftimeMatchService({
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

  /* UPDATE MATCH */

  batch.update(
    matchRef,

    {

      status:
        'halftime',

      currentMinute:
        currentMinute,

      updatedAt:
        serverTimestamp(),
    },
  );

  /* CREATE EVENT */

  const eventRef =
    doc(
      eventsRef,
    );

  batch.set(
    eventRef,

    {

      type:
        'halftime',

      minute:
        currentMinute,

      matchId,

      teamId:
        '',

      createdAt:
        serverTimestamp(),
    },
  );

  await batch.commit();
}