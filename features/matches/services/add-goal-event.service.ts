import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

type Params = {

  matchId: string;

  side: 'home' | 'away';

  minute: number;

  player?: {

    id: string;

    name: string;
  };
};

export async function addGoalEventService({
  matchId,
  side,
  minute,
  player,
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

  /* UPDATE SCORE */

  batch.update(
    matchRef,

    {

      updatedAt:
        serverTimestamp(),

      ...(side === 'home'

        ? {
            scoreHome:
              increment(
                1,
              ),
          }

        : {
            scoreAway:
              increment(
                1,
              ),
          }),
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

      type: 'goal',

      minute,

      side,

      player:
        player || null,

      createdAt:
        serverTimestamp(),
    },
  );

  await batch.commit();
}