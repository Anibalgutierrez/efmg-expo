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
  Match,
} from '../types/match.types';

type Callback = (
  matches: Match[],
) => void;

export function subscribeMatchesService(
  callback: Callback,
) {

  const ref =
    collection(
      db,
      'matches',
    );

  const q =
    query(
      ref,
      orderBy(
        'scheduledAt',
        'desc',
      ),
    );

  return onSnapshot(
    q,
    (
      snapshot,
    ) => {

      const matches =
        snapshot.docs.map(
          (
            doc,
          ) => ({

            id: doc.id,

            ...doc.data(),

          }),
        ) as Match[];

      callback(
        matches,
      );
    },
  );
}