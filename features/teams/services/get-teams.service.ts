import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Team,
} from '../types/team.types';

export async function getTeamsService() {

  const teamsRef =
    collection(
      db,
      'teams',
    );

  const teamsQuery =
    query(
      teamsRef,
      orderBy(
        'name',
        'asc',
      ),
    );

  const snapshot =
    await getDocs(
      teamsQuery,
    );

  const teams: Team[] =
    snapshot.docs.map(
      (
        doc,
      ) => ({

        id:
          doc.id,

        ...doc.data(),
      }),
    ) as Team[];

  return teams;
}