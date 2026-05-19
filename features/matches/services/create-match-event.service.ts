import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  MatchEvent,
} from '../types/match-event.types';

type Params = {

  matchId: string;

  event: Omit<
    MatchEvent,
    'id' |
    'createdAt'
  >;
};

export async function createMatchEventService({
  matchId,
  event,
}: Params) {

  await addDoc(

    collection(
      db,
      'matches',
      matchId,
      'events',
    ),

    {

      ...event,

      createdAt:
        serverTimestamp(),
    },
  );
}