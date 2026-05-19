import {
  Timestamp,
} from 'firebase/firestore';

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'finished'
  | 'cancelled';

export interface MatchPlayer {

  id: string;

  name: string;
}

export interface MatchTeam {

  id: string;

  name: string;

  logo?: string;

  players?: MatchPlayer[];
}

export interface MatchCategory {

  id: string;

  name: string;
}

export interface Match {

  id: string;

  homeTeam: MatchTeam;

  awayTeam: MatchTeam;

  category: MatchCategory;

  venue: string;

  scheduledAt: Timestamp;

  status: MatchStatus;

  scoreHome: number;

  scoreAway: number;

  currentMinute: number;

  startedAt?: Timestamp | null;

  isLive: boolean;

  createdAt: Timestamp;

  updatedAt: Timestamp;
}