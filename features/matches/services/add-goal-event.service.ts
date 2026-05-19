import {
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  createMatchEventService,
} from './create-match-event.service';

type Params = {

  matchId: string;

  side: 'home' | 'away';

  minute: number;

  player?: {

    id: string;

    name: string;
  };

  teamId: string;
};

export async function addGoalEventService({
  matchId,
  side,
  minute,
  player,
  teamId,
}: Params) {

  const matchRef =
    doc(
      db,
      'matches',
      matchId,
    );

  /* UPDATE SCORE */

  await updateDoc(

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

  await createMatchEventService({

    matchId,

    event: {

      type: 'goal',

      minute,

      matchId,

      teamId,

      teamSide:
        side,

      player:
        player || undefined,
    },
  });
}