import {
  useEffect,
  useState,
} from 'react';

import {
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
} from 'expo-router';

import Screen
from '../../../components/ui/Screen';

import useTheme
from '../../../hooks/useTheme';

import {
  Match,
} from '../../../features/matches/types/match.types';

import {
  MatchEvent,
} from '../../../features/matches/types/match-event.types';

import {
  subscribeMatchService,
} from '../../../features/matches/services/subscribe-match.service';

import {
  subscribeMatchEventsService,
} from '../../../features/matches/services/subscribe-match-events.service';

import MatchTimeline
from '../../../features/matches/components/MatchTimeline';

import useMatchClock
from '../../../features/matches/hooks/useMatchClock';

import {
  SPACING,
} from '../../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../../theme/typography';

import {
  RADIUS,
} from '../../../theme/radius';

export default function MatchDetailsScreen() {

  const {
    matchId,
  } = useLocalSearchParams();

  const {
    COLORS,
  } = useTheme();

  const [
    match,
    setMatch,
  ] = useState<Match | null>(
    null,
  );

  const liveMinute =
    useMatchClock(
      match,
    );

  const [
    events,
    setEvents,
  ] = useState<MatchEvent[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(
    true,
  );

  /* MATCH REALTIME */

  useEffect(
    () => {

      const unsubscribe =
        subscribeMatchService(

          String(
            matchId,
          ),

          (
            data,
          ) => {

            setMatch(
              data,
            );

            setLoading(
              false,
            );
          },
        );

      return () =>
        unsubscribe();
    },

    [
      matchId,
    ],
  );

  /* EVENTS REALTIME */

  useEffect(
    () => {

      const unsubscribe =
        subscribeMatchEventsService(

          String(
            matchId,
          ),

          (
            data,
          ) => {

            setEvents(
              data,
            );
          },
        );

      return () =>
        unsubscribe();
    },

    [
      matchId,
    ],
  );

  if (
    loading
  ) {

    return (

      <Screen>

        <View
          style={{

            flex: 1,

            justifyContent:
              'center',

            alignItems:
              'center',
          }}
        >

          <Text
            style={{
              color:
                COLORS.textSecondary,
            }}
          >
            Cargando...
          </Text>

        </View>

      </Screen>
    );
  }

  if (
    !match
  ) {

    return (

      <Screen>

        <View
          style={{

            flex: 1,

            justifyContent:
              'center',

            alignItems:
              'center',
          }}
        >

          <Text
            style={{
              color:
                COLORS.textSecondary,
            }}
          >
            Partido no encontrado
          </Text>

        </View>

      </Screen>
    );
  }

  return (

    <Screen>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* SCOREBOARD */}

        <View
          style={{

            backgroundColor:
              COLORS.surface,

            margin:
              SPACING.md,

            borderRadius:
              RADIUS.lg,

            padding:
              SPACING.lg,
          }}
        >

          <Text
            style={{

              color:
                COLORS.textSecondary,

              marginBottom:
                SPACING.sm,

              fontSize:
                TYPOGRAPHY.caption,
            }}
          >
            {match.category?.name ||
              'Sin categoría'}
          </Text>

          <View
            style={{
              gap:
                SPACING.md,
            }}
          >

            {/* HOME */}

            <View
              style={{

                flexDirection:
                  'row',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',
              }}
            >

              <Text
                style={{

                  color:
                    COLORS.text,

                  fontSize:
                    TYPOGRAPHY.body,

                  fontWeight:
                    '700',

                  flex: 1,
                }}
              >
                {match.homeTeam?.name ||
                  'Local'}
              </Text>

              <Text
                style={{

                  color:
                    COLORS.text,

                  fontSize: 42,

                  fontWeight:
                    '800',
                }}
              >
                {match.scoreHome}
              </Text>

            </View>

            {/* AWAY */}

            <View
              style={{

                flexDirection:
                  'row',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',
              }}
            >

              <Text
                style={{

                  color:
                    COLORS.text,

                  fontSize:
                    TYPOGRAPHY.body,

                  fontWeight:
                    '700',

                  flex: 1,
                }}
              >
                {match.awayTeam?.name ||
                  'Visitante'}
              </Text>

              <Text
                style={{

                  color:
                    COLORS.text,

                  fontSize: 42,

                  fontWeight:
                    '800',
                }}
              >
                {match.scoreAway}
              </Text>

            </View>

          </View>

          {/* STATUS */}

          <View
            style={{
              marginTop:
                SPACING.lg,
            }}
          >

            <Text
              style={{

                color:
                  match.status ===
                  'live'
                    ? COLORS.success
                    : COLORS.textSecondary,

                fontWeight:
                  '700',

                fontSize:
                  TYPOGRAPHY.body,
              }}
            >

              {match.status ===
              'live'

                ? `🟢 EN VIVO ${liveMinute}'`

                : match.status ===
                  'halftime'

                ? '⏸ DESCANSO'

                : match.status ===
                  'finished'

                ? 'FINAL'

                : 'PROGRAMADO'}
            </Text>

            <Text
              style={{

                color:
                  COLORS.textSecondary,

                marginTop:
                  SPACING.sm,
              }}
            >
              {match.venue}
            </Text>

          </View>

        </View>

        {/* TIMELINE */}

        <View
          style={{

            backgroundColor:
              COLORS.surface,

            marginHorizontal:
              SPACING.md,

            borderRadius:
              RADIUS.lg,

            padding:
              SPACING.md,

            marginBottom:
              SPACING.xxl,
          }}
        >

          <Text
            style={{

              color:
                COLORS.text,

              fontWeight:
                '700',

              marginBottom:
                SPACING.md,

              fontSize:
                TYPOGRAPHY.body,
            }}
          >
            Timeline
          </Text>

          <MatchTimeline
            events={events}
          />

        </View>

      </ScrollView>

    </Screen>
  );
}