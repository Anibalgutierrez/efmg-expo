import {
  addDoc,
  collection,
  getDocs,
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

import {
  TournamentId,
} from '../types/tournament.types';

import {
  createNotification,
} from '../../../services/notifications/notifications.service';



type Params = {

  tournamentId:
    TournamentId;

  homeTeam: Team;

  awayTeam: Team;

  category: Category;

  venue: string;

  scheduledAt: Date;
};

export async function createMatchService({
  tournamentId,
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

      /* TOURNAMENT */

      tournamentId,

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

        players:
          homeTeam.players || [],
      },

      awayTeam: {

        id:
          awayTeam.id,

        name:
          awayTeam.name,

        logo:
          awayTeam.logo || '',

        players:
          awayTeam.players || [],
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

  

  // =========================
  // NOTIFICATIONS
  // =========================

  const usersSnapshot =
    await getDocs(

      collection(
        db,
        'users',
      ),
    );

  await Promise.all(

    usersSnapshot.docs.map(
      (
        userDoc,
      ) =>

        createNotification({

          receiverId:
            userDoc.id,

          type:
            'match',

          senderId:
            'system',

          senderName:
            'EFMG',

          senderAvatar:
            '',

          text:

            `${homeTeam.name} vs ${awayTeam.name} · ${category.name}`,
        }),
    ),
  );
}