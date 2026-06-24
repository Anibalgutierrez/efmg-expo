import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
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

const MATCHES_LIMIT = 10;

type GetMatchesParams = {

  tournamentId?:
    TournamentId;

  lastVisible?: any;
};

type GetMatchesResponse = {

  matches: Match[];

  lastVisible: any | null;

  hasMore: boolean;
};

export async function getMatchesService({
  tournamentId,
  lastVisible,
}: GetMatchesParams = {}): Promise<GetMatchesResponse> {

  const matchesRef =
    collection(
      db,
      'matches',
    );

  const constraints: any[] =
    [];

  if (
    tournamentId
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

  if (
    lastVisible
  ) {

    constraints.push(

      startAfter(
        lastVisible,
      ),
    );
  }

  constraints.push(

    limit(
      MATCHES_LIMIT,
    ),
  );

  const matchesQuery =
    query(
      matchesRef,
      ...constraints,
    );

  const snapshot =
    await getDocs(
      matchesQuery,
    );

  const matches: Match[] =
    snapshot.docs.map(
      (
        doc,
      ) => ({

        id:
          doc.id,

        ...doc.data(),

      }),
    ) as Match[];

  const newLastVisible =
    snapshot.docs[
      snapshot.docs.length - 1
    ] || null;

  return {

    matches,

    lastVisible:
      newLastVisible,

    hasMore:
      snapshot.docs.length ===
      MATCHES_LIMIT,
  };
}