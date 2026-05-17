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
            await getMatchesService();

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
            await getMatchesService();

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
        setRefreshing,
        setMatches,
        setLastVisible,
        setHasMore,
      ],
    );

  useEffect(
    () => {

      if (
        matches.length === 0
      ) {

        loadInitialMatches();
      }
    },

    [
      matches.length,
      loadInitialMatches,
    ],
  );

  return {

    matches,

    loading,

    refreshing,

    selectedFilter,

    loadInitialMatches,

    loadMoreMatches,

    refreshMatches,
  };
}