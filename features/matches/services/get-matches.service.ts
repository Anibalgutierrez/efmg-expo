import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Match,
} from '../types/match.types';

const MATCHES_LIMIT = 10;

type GetMatchesParams = {
  lastVisible?: any;
};

type GetMatchesResponse = {

  matches: Match[];

  lastVisible: any | null;

  hasMore: boolean;
};

export async function getMatchesService({
  lastVisible,
}: GetMatchesParams = {}): Promise<GetMatchesResponse> {

  const matchesRef =
    collection(
      db,
      'matches',
    );

  const matchesQuery =
    lastVisible
      ? query(
          matchesRef,
          orderBy(
            'scheduledAt',
            'desc',
          ),
          startAfter(
            lastVisible,
          ),
          limit(
            MATCHES_LIMIT,
          ),
        )
      : query(
          matchesRef,
          orderBy(
            'scheduledAt',
            'desc',
          ),
          limit(
            MATCHES_LIMIT,
          ),
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

        id: doc.id,

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