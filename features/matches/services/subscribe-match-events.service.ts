import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  MatchEvent,
} from '../types/match-event.types';

type Callback = (
  events: MatchEvent[],
) => void;

export function subscribeMatchEventsService(
  matchId: string,
  callback: Callback,
) {

  const ref =
    collection(
      db,
      'matches',
      matchId,
      'events',
    );

  const eventsQuery =
    query(
      ref,
      orderBy(
        'minute',
        'desc',
      ),
    );

  return onSnapshot(
    eventsQuery,
    (
      snapshot,
    ) => {

      const events =
        snapshot.docs.map(
          (
            doc,
          ) => ({

            id: doc.id,

            ...doc.data(),

          }),
        ) as MatchEvent[];

      callback(
        events,
      );
    },
  );
}