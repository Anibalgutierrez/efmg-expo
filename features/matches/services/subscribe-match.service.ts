import {
  doc,
  onSnapshot,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Match,
} from '../types/match.types';

type Callback = (
  match: Match | null,
) => void;

export function subscribeMatchService(
  matchId: string,
  callback: Callback,
) {

  const ref =
    doc(
      db,
      'matches',
      matchId,
    );

  return onSnapshot(
    ref,
    (
      snapshot,
    ) => {

      if (
        !snapshot.exists()
      ) {

        callback(
          null,
        );

        return;
      }

      callback({

        id: snapshot.id,

        ...snapshot.data(),

      } as Match);
    },
  );
}