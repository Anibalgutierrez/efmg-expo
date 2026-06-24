import { create } from 'zustand';

import {
  Match,
} from '../types/match.types';

import {
  TournamentId,
} from '../types/tournament.types';

export type MatchFilter =
  | 'all'
  | 'live'
  | 'today'
  | 'upcoming'
  | 'finished';

type MatchesStore = {

  matches: Match[];

  loading: boolean;

  refreshing: boolean;

  selectedFilter: MatchFilter;

  selectedTournament:
    TournamentId | 'all';

  lastVisible: any | null;

  hasMore: boolean;

  setMatches: (
    matches: Match[],
  ) => void;

  appendMatches: (
    matches: Match[],
  ) => void;

  setLoading: (
    value: boolean,
  ) => void;

  setRefreshing: (
    value: boolean,
  ) => void;

  setFilter: (
    filter: MatchFilter,
  ) => void;

  setTournament: (
    tournament:
      TournamentId | 'all',
  ) => void;

  setLastVisible: (
    value: any,
  ) => void;

  setHasMore: (
    value: boolean,
  ) => void;

  resetMatches: () => void;
};

export const useMatchesStore =
  create<MatchesStore>(
    (set) => ({

      matches: [],

      loading: false,

      refreshing: false,

      selectedFilter:
        'all',

      selectedTournament:
        'all',

      lastVisible: null,

      hasMore: true,

      setMatches: (
        matches,
      ) =>
        set({
          matches,
        }),

      appendMatches: (
        newMatches,
      ) =>
        set(
          (
            state,
          ) => ({

            matches: [
              ...state.matches,
              ...newMatches,
            ],

          }),
        ),

      setLoading: (
        value,
      ) =>
        set({
          loading: value,
        }),

      setRefreshing: (
        value,
      ) =>
        set({
          refreshing: value,
        }),

      setFilter: (
        filter,
      ) =>
        set({
          selectedFilter:
            filter,
        }),

      setTournament: (
        tournament,
      ) =>
        set({
          selectedTournament:
            tournament,
        }),

      setLastVisible: (
        value,
      ) =>
        set({
          lastVisible:
            value,
        }),

      setHasMore: (
        value,
      ) =>
        set({
          hasMore: value,
        }),

      resetMatches: () =>
        set({

          matches: [],

          loading: false,

          refreshing: false,

          selectedFilter:
            'all',

          selectedTournament:
            'all',

          lastVisible:
            null,

          hasMore: true,

        }),

    }),
  );