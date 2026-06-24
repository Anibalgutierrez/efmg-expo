import {
  useCallback,
  useEffect,
} from 'react';

import {
  getMatchesService,
} from '../services/get-matches.service';

import {
  useMatchesStore,
} from '../store/matches.store';

export default function useMatches() {

  const {

    matches,

    loading,

    refreshing,

    lastVisible,

    hasMore,

    selectedFilter,

    selectedTournament,

    setMatches,

    appendMatches,

    setLoading,

    setRefreshing,

    setLastVisible,

    setHasMore,

  } = useMatchesStore();

  const loadInitialMatches =
    useCallback(
      async () => {

        try {

          setLoading(
            true,
          );

          const response =
            await getMatchesService({

              tournamentId:
                selectedTournament ===
                'all'
                  ? undefined
                  : selectedTournament,
            });

          setMatches(
            response.matches,
          );

          setLastVisible(
            response.lastVisible,
          );

          setHasMore(
            response.hasMore,
          );

        } catch (
          error
        ) {

          console.log(
            'loadInitialMatches error:',
            error,
          );

        } finally {

          setLoading(
            false,
          );
        }
      },

      [
        selectedTournament,
        setLoading,
        setMatches,
        setLastVisible,
        setHasMore,
      ],
    );

  const loadMoreMatches =
    useCallback(
      async () => {

        if (
          loading ||
          !hasMore
        ) {
          return;
        }

        try {

          setLoading(
            true,
          );

          const response =
            await getMatchesService({

              tournamentId:
                selectedTournament ===
                'all'
                  ? undefined
                  : selectedTournament,

              lastVisible,
            });

          appendMatches(
            response.matches,
          );

          setLastVisible(
            response.lastVisible,
          );

          setHasMore(
            response.hasMore,
          );

        } catch (
          error
        ) {

          console.log(
            'loadMoreMatches error:',
            error,
          );

        } finally {

          setLoading(
            false,
          );
        }
      },

      [
        loading,
        hasMore,
        lastVisible,
        selectedTournament,
        appendMatches,
        setLoading,
        setLastVisible,
        setHasMore,
      ],
    );

  const refreshMatches =
    useCallback(
      async () => {

        try {

          setRefreshing(
            true,
          );

          const response =
            await getMatchesService({

              tournamentId:
                selectedTournament ===
                'all'
                  ? undefined
                  : selectedTournament,
            });

          setMatches(
            response.matches,
          );

          setLastVisible(
            response.lastVisible,
          );

          setHasMore(
            response.hasMore,
          );

        } catch (
          error
        ) {

          console.log(
            'refreshMatches error:',
            error,
          );

        } finally {

          setRefreshing(
            false,
          );
        }
      },

      [
        selectedTournament,
        setRefreshing,
        setMatches,
        setLastVisible,
        setHasMore,
      ],
    );

  useEffect(
    () => {

      loadInitialMatches();
    },

    [
      loadInitialMatches,
    ],
  );

  return {

    matches,

    loading,

    refreshing,

    selectedFilter,

    selectedTournament,

    loadInitialMatches,

    loadMoreMatches,

    refreshMatches,
  };
}