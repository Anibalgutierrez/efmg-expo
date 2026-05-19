import {
  MatchStatus,
} from '../types/match.types';

export function getMatchStatusLabel(
  status: MatchStatus,
  minute?: number,
) {

  switch (status) {

    case 'live':
      return `🟢 EN VIVO ${minute || 0}'`;

    case 'halftime':
      return '⏸ DESCANSO';

    case 'finished':
      return 'FINAL';

    default:
      return 'PROGRAMADO';
  }
}