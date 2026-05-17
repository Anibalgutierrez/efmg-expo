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
} from 'expo-router';

import Screen
from '../../components/ui/Screen';

import useTheme
from '../../hooks/useTheme';

import {
  Match,
} from '../../features/matches/types/match.types';

import {
  subscribeMatchService,
} from '../../features/matches/services/subscribe-match.service';

import {
  addGoalEventService,
} from '../../features/matches/services/add-goal-event.service';

import {
  startMatchService,
} from '../../features/matches/services/start-match.service';

import {
  halftimeMatchService,
} from '../../features/matches/services/halftime-match.service';

import {
  finishMatchService,
} from '../../features/matches/services/finish-match.service';

import useMatchClock
from '../../features/matches/hooks/useMatchClock';

import {
  SPACING,
} from '../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../theme/typography';

import {
  RADIUS,
} from '../../theme/radius';

export default function MatchControlScreen() {

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
    loading,
    setLoading,
  ] = useState(
    true,
  );

  const [
    actionLoading,
    setActionLoading,
  ] = useState(
    false,
  );

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

  async function handleGoal(
    side: 'home' | 'away',
  ) {

    if (
      !match ||
      actionLoading
    ) {
      return;
    }

    try {

      setActionLoading(
        true,
      );

      await addGoalEventService({

        matchId:
          match.id,

        side,

        minute:
          liveMinute,
      });

    } catch (
      error
    ) {

      console.log(
        'handleGoal error:',
        error,
      );

    } finally {

      setActionLoading(
        false,
      );
    }
  }

  async function handleStartMatch() {

    if (
      !match ||
      actionLoading
    ) {
      return;
    }

    try {

      setActionLoading(
        true,
      );

      await startMatchService({

        matchId:
          match.id,
      });

    } catch (
      error
    ) {

      console.log(
        'handleStartMatch error:',
        error,
      );

    } finally {

      setActionLoading(
        false,
      );
    }
  }

  async function handleHalftime() {

    if (
      !match ||
      actionLoading
    ) {
      return;
    }

    try {

      setActionLoading(
        true,
      );

      await halftimeMatchService({

        matchId:
          match.id,

        currentMinute:
          liveMinute,
      });

    } catch (
      error
    ) {

      console.log(
        'handleHalftime error:',
        error,
      );

    } finally {

      setActionLoading(
        false,
      );
    }
  }

  async function handleFinishMatch() {

    if (
      !match ||
      actionLoading
    ) {
      return;
    }

    try {

      setActionLoading(
        true,
      );

      await finishMatchService({

        matchId:
          match.id,
      });

    } catch (
      error
    ) {

      console.log(
        'handleFinishMatch error:',
        error,
      );

    } finally {

      setActionLoading(
        false,
      );
    }
  }

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

        {/* CONTROLS */}

        <View
          style={{

            paddingHorizontal:
              SPACING.md,

            gap:
              SPACING.md,

            marginBottom:
              SPACING.xxl,
          }}
        >

          {/* START */}

          {
            match.status ===
              'scheduled' && (

              <Pressable

                disabled={
                  actionLoading
                }

                onPress={
                  handleStartMatch
                }

                style={{

                  backgroundColor:
                    COLORS.success,

                  borderRadius:
                    RADIUS.lg,

                  padding:
                    SPACING.lg,

                  alignItems:
                    'center',
                }}
              >

                <Text
                  style={{

                    color:
                      COLORS.buttonText,

                    fontSize:
                      TYPOGRAPHY.body,

                    fontWeight:
                      '800',
                  }}
                >
                  ▶ Iniciar Partido
                </Text>

              </Pressable>
            )
          }

          {/* HALFTIME */}

          {
            match.status ===
              'live' && (

              <Pressable

                disabled={
                  actionLoading
                }

                onPress={
                  handleHalftime
                }

                style={{

                  backgroundColor:
                    COLORS.primary,

                  borderRadius:
                    RADIUS.lg,

                  padding:
                    SPACING.lg,

                  alignItems:
                    'center',
                }}
              >

                <Text
                  style={{

                    color:
                      COLORS.buttonText,

                    fontSize:
                      TYPOGRAPHY.body,

                    fontWeight:
                      '800',
                  }}
                >
                  ⏸ Descanso
                </Text>

              </Pressable>
            )
          }

          {/* SECOND HALF */}

          {
            match.status ===
              'halftime' && (

              <Pressable

                disabled={
                  actionLoading
                }

                onPress={
                  handleStartMatch
                }

                style={{

                  backgroundColor:
                    COLORS.success,

                  borderRadius:
                    RADIUS.lg,

                  padding:
                    SPACING.lg,

                  alignItems:
                    'center',
                }}
              >

                <Text
                  style={{

                    color:
                      COLORS.buttonText,

                    fontSize:
                      TYPOGRAPHY.body,

                    fontWeight:
                      '800',
                  }}
                >
                  ▶ Segundo Tiempo
                </Text>

              </Pressable>
            )
          }

          {/* FINISH */}

          {
            (
              match.status ===
                'live' ||

              match.status ===
                'halftime'
            ) && (

              <Pressable

                disabled={
                  actionLoading
                }

                onPress={
                  handleFinishMatch
                }

                style={{

                  backgroundColor:
                    COLORS.danger,

                  borderRadius:
                    RADIUS.lg,

                  padding:
                    SPACING.lg,

                  alignItems:
                    'center',
                }}
              >

                <Text
                  style={{

                    color:
                      COLORS.buttonText,

                    fontSize:
                      TYPOGRAPHY.body,

                    fontWeight:
                      '800',
                  }}
                >
                  🏁 Finalizar Partido
                </Text>

              </Pressable>
            )
          }

          {/* GOALS */}

          {
            (
              match.status ===
                'live' ||

              match.status ===
                'halftime'
            ) && (

              <>

                <Pressable

                  disabled={
                    actionLoading
                  }

                  onPress={() =>
                    handleGoal(
                      'home',
                    )
                  }

                  style={{

                    backgroundColor:
                      COLORS.success,

                    borderRadius:
                      RADIUS.lg,

                    padding:
                      SPACING.lg,

                    alignItems:
                      'center',
                  }}
                >

                  <Text
                    style={{

                      color:
                        COLORS.buttonText,

                      fontSize:
                        TYPOGRAPHY.body,

                      fontWeight:
                        '800',
                    }}
                  >
                    ⚽ Gol Local
                  </Text>

                </Pressable>

                <Pressable

                  disabled={
                    actionLoading
                  }

                  onPress={() =>
                    handleGoal(
                      'away',
                    )
                  }

                  style={{

                    backgroundColor:
                      COLORS.primary,

                    borderRadius:
                      RADIUS.lg,

                    padding:
                      SPACING.lg,

                    alignItems:
                      'center',
                  }}
                >

                  <Text
                    style={{

                      color:
                        COLORS.buttonText,

                      fontSize:
                        TYPOGRAPHY.body,

                      fontWeight:
                        '800',
                    }}
                  >
                    ⚽ Gol Visitante
                  </Text>

                </Pressable>

              </>
            )
          }

          {
            match.status ===
              'finished' && (

              <View
                style={{

                  backgroundColor:
                    COLORS.surface,

                  borderRadius:
                    RADIUS.lg,

                  padding:
                    SPACING.lg,

                  alignItems:
                    'center',
                }}
              >

                <Text
                  style={{

                    color:
                      COLORS.textSecondary,

                    fontSize:
                      TYPOGRAPHY.body,

                    fontWeight:
                      '700',
                  }}
                >
                  Partido finalizado
                </Text>

              </View>
            )
          }

        </View>

      </ScrollView>

    </Screen>
  );
}