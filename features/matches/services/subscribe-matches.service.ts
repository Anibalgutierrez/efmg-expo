import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Match,
} from '../types/match.types';

import {
  TournamentId,
} from '../types/tournament.types';

type Callback = (
  matches: Match[],
) => void;

export function subscribeMatchesService(

  tournamentId:
    TournamentId | 'all',

  callback: Callback,
) {

  const ref =
    collection(
      db,
      'matches',
    );

  const constraints: any[] =
    [];

  if (
    tournamentId !==
    'all'
  ) {

    constraints.push(

      where(
        'tournamentId',
        '==',
        tournamentId,
      ),
    );
  }

  constraints.push(

    orderBy(
      'scheduledAt',
      'desc',
    ),
  );

  const q =
    query(
      ref,
      ...constraints,
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