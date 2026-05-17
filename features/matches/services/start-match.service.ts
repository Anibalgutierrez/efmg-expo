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
};

export async function startMatchService({
  matchId,
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
        'live',

      isLive:
        true,

      currentMinute:
        1,

      startedAt:
        serverTimestamp(),

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
        'match_started',

      minute:
        1,

      matchId,

      teamId:
        '',

      createdAt:
        serverTimestamp(),
    },
  );

  await batch.commit();
}