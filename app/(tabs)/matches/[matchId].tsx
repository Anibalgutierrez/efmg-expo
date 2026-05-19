import {
  useEffect,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import Screen
from '../../../components/ui/Screen';

import useTheme
from '../../../hooks/useTheme';

import useCanControlMatches
from '../../../hooks/useCanControlMatches';

import MatchTimeline
from '../../../features/matches/components/MatchTimeline';

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

  const router =
    useRouter();

  const {
    matchId,
  } = useLocalSearchParams();

  const {
    COLORS,
  } = useTheme();

  const canControlMatches =
    useCanControlMatches();

  const [
    match,
    setMatch,
  ] = useState<Match | null>(
    null,
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

  useEffect(
    () => {

      if (
        !matchId
      ) {
        return;
      }

      const unsubscribeMatch =
        subscribeMatchService(
          String(matchId),
          (
            data,
          ) => {

            setMatch(
              data,
            );
          },
        );

      const unsubscribeEvents =
        subscribeMatchEventsService(
          String(matchId),
          (
            data,
          ) => {

            setEvents(
              data,
            );

            setLoading(
              false,
            );
          },
        );

      return () => {

        unsubscribeMatch();
        unsubscribeEvents();
      };
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
            Cargando partido...
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
                COLORS.text,
            }}
          >
            Partido no encontrado.
          </Text>

        </View>

      </Screen>
    );
  }

  return (

    <Screen>

      <ScrollView
        contentContainerStyle={{
          padding:
            SPACING.md,
        }}
      >

        <View
          style={{
            marginBottom:
              SPACING.lg,
          }}
        >

          <Text
            style={{

              color:
                COLORS.text,

              fontSize:
                TYPOGRAPHY.title,

              fontWeight:
                '800',

              textAlign:
                'center',
            }}
          >
            {match.homeTeam.name}
            {' - '}
            {match.awayTeam.name}
          </Text>

          <Text
            style={{

              color:
                COLORS.text,

              fontSize: 42,

              fontWeight:
                '900',

              textAlign:
                'center',

              marginVertical:
                SPACING.sm,
            }}
          >
            {match.scoreHome}
            {'    -    '}
            {match.scoreAway}
          </Text>

        </View>

        {
          canControlMatches && (

            <Pressable

              onPress={() =>
                router.push(
                  `/match-control/${match.id}`,
                )
              }

              style={{

                backgroundColor:
                  COLORS.primary,

                padding:
                  SPACING.md,

                borderRadius:
                  RADIUS.lg,

                alignItems:
                  'center',

                marginBottom:
                  SPACING.lg,
              }}
            >

              <Text
                style={{

                  color:
                    COLORS.buttonText,

                  fontWeight:
                    '800',

                  fontSize:
                    TYPOGRAPHY.body,
                }}
              >
                Ir a controles
              </Text>

            </Pressable>
          )
        }

        <MatchTimeline
          events={events}
          match={match}
        />

      </ScrollView>

    </Screen>
  );
}