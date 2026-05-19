export type MatchEventType =
  | 'goal'
  | 'yellow_card'
  | 'red_card'
  | 'substitution'
  | 'match_started'
  | 'halftime'
  | 'second_half_started'
  | 'match_finished';

export interface MatchEvent {

  id: string;

  type: MatchEventType;

  minute: number;

  matchId: string;

  teamId?: string;

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

  metadata?: Record<
    string,
    any
  >;

  createdAt: any;
}