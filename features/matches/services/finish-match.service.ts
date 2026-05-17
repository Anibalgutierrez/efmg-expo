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

export async function finishMatchService({
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
        'finished',

      isLive:
        false,

      currentMinute:
        90,

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
        'match_finished',

      minute:
        90,

      matchId,

      teamId:
        '',

      createdAt:
        serverTimestamp(),
    },
  );

  await batch.commit();
}