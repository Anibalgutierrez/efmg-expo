import {
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Match,
} from '../types/match.types';

export async function getMatchByIdService(
  matchId: string,
): Promise<Match | null> {

  const matchRef =
    doc(
      db,
      'matches',
      matchId,
    );

  const snapshot =
    await getDoc(
      matchRef,
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  return {

    id: snapshot.id,

    ...snapshot.data(),

  } as Match;
}