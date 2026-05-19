import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  MatchPlayer,
} from '../types/match.types';

type Params = {

  matchId: string;

  type:
    | 'yellow_card'
    | 'red_card';

  side:
    | 'home'
    | 'away';

  minute: number;

  teamId: string;

  player: MatchPlayer;
};

export async function addCardEventService({
  matchId,
  type,
  side,
  minute,
  teamId,
  player,
}: Params) {

  const batch =
    writeBatch(
      db,
    );

  const eventsRef =
    collection(
      db,
      'matches',
      matchId,
      'events',
    );

  const eventRef =
    doc(
      eventsRef,
    );

  batch.set(
    eventRef,

    {

      type,

      minute,

      matchId,

      teamId,

      teamSide:
        side,

      player,

      createdAt:
        serverTimestamp(),
    },
  );

  await batch.commit();
}