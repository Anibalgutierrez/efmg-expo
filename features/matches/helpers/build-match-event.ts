import {
  serverTimestamp,
} from 'firebase/firestore';

import {
  MatchEventType,
} from '../types/match-event.types';

type Params = {

  type: MatchEventType;

  minute: number;

  matchId: string;

  teamId: string;

  teamSide?: 'home' | 'away';

  player?: {

    id: string;

    name: string;
  };

  assistPlayer?: {

    id: string;

    name: string;
  };

  description?: string;
};

export function buildMatchEvent({

  type,

  minute,

  matchId,

  teamId,

  teamSide,

  player,

  assistPlayer,

  description,
}: Params) {

  return {

    type,

    minute,

    matchId,

    teamId,

    teamSide:
      teamSide || null,

    player:
      player || null,

    assistPlayer:
      assistPlayer || null,

    description:
      description || '',

    createdAt:
      serverTimestamp(),
  };
}