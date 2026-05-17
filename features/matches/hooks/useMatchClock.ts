import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Match,
} from '../types/match.types';

export default function useMatchClock(
  match: Match | null,
) {

  const [
    now,
    setNow,
  ] = useState(
    Date.now(),
  );

  useEffect(
    () => {

      if (
        !match ||
        match.status !==
          'live' ||
        !match.startedAt
      ) {
        return;
      }

      const interval =
        setInterval(
          () => {

            setNow(
              Date.now(),
            );
          },

          15000,
        );

      return () =>
        clearInterval(
          interval,
        );
    },

    [
      match,
    ],
  );

  const minute =
    useMemo(
      () => {

        if (!match) {
          return 0;
        }

        const baseMinute =
          match.currentMinute || 1;

        if (
          !match.startedAt
        ) {
          return baseMinute;
        }

        const startedAtMs =

          match.startedAt
            ?.toDate?.()
            ?.getTime?.();

        if (
          !startedAtMs
        ) {
          return baseMinute;
        }

        const diffMs =
          now -
          startedAtMs;

        const diffMinutes =
          Math.floor(
            diffMs /
              60000,
          );

        /*
          Minuto real live.

          Ejemplo:

          currentMinute = 1
          pasan 15 minutos
          resultado = 16'
        */

        const liveMinute =
          baseMinute +
          diffMinutes;

        /*
          Protección:
          nunca menor al baseMinute
        */

        return Math.max(
          baseMinute,
          liveMinute,
        );
      },

      [
        match,
        now,
      ],
    );

  return minute;
}