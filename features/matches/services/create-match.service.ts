import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Team,
} from '../../teams/types/team.types';

import {
  Category,
} from '../../categories/types/category.types';

type Params = {

  homeTeam: Team;

  awayTeam: Team;

  category: Category;

  venue: string;

  scheduledAt: Date;
};

export async function createMatchService({
  homeTeam,
  awayTeam,
  category,
  venue,
  scheduledAt,
}: Params) {

  await addDoc(

    collection(
      db,
      'matches',
    ),

    {

      /* TEAM IDS */

      homeTeamId:
        homeTeam.id,

      awayTeamId:
        awayTeam.id,

      /* TEAM SNAPSHOT */

      homeTeam: {

        id:
          homeTeam.id,

        name:
          homeTeam.name,

        logo:
          homeTeam.logo || '',
      },

      awayTeam: {

        id:
          awayTeam.id,

        name:
          awayTeam.name,

        logo:
          awayTeam.logo || '',
      },

      /* CATEGORY */

      categoryId:
        category.id,

      category: {

        id:
          category.id,

        name:
          category.name,
      },

      /* MATCH */

      venue,

      scheduledAt,

      status:
        'scheduled',

      scoreHome: 0,

      scoreAway: 0,

      currentMinute: 0,

      startedAt: null,

      isLive: false,

      /* TIMESTAMPS */

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
  );
}