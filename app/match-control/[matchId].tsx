import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import Screen
  from '../../components/ui/Screen';

import Header
  from '../../components/ui/Header';

import useTheme
  from '../../hooks/useTheme';

import useCanControlMatches
  from '../../hooks/useCanControlMatches';

import {
  Match,
  MatchPlayer,
} from '../../features/matches/types/match.types';

import {
  subscribeMatchService,
} from '../../features/matches/services/subscribe-match.service';

import {
  startMatchService,
} from '../../features/matches/services/start-match.service';

import {
  finishMatchService,
} from '../../features/matches/services/finish-match.service';

import {
  halftimeMatchService,
} from '../../features/matches/services/halftime-match.service';

import {
  addGoalEventService,
} from '../../features/matches/services/add-goal-event.service';

import {
  addCardEventService,
} from '../../features/matches/services/add-card-event.service';

import useMatchClock
  from '../../features/matches/hooks/useMatchClock';

import PlayerSelectModal
  from '../../features/matches/components/PlayerSelectModal';

import {
  resumeMatchService,
} from '../../features/matches/services/resume-match.service';

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

  const canControlMatches =
    useCanControlMatches();

  const [
    match,
    setMatch,
  ] = useState<Match | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(
    true,
  );

  const [
    goalModalVisible,
    setGoalModalVisible,
  ] = useState(
    false,
  );

  const [
    awayGoalModalVisible,
    setAwayGoalModalVisible,
  ] = useState(
    false,
  );

  const [
    yellowModalVisible,
    setYellowModalVisible,
  ] = useState(
    false,
  );

  const [
    awayYellowModalVisible,
    setAwayYellowModalVisible,
  ] = useState(
    false,
  );

  const [
    redModalVisible,
    setRedModalVisible,
  ] = useState(
    false,
  );

  const [
    awayRedModalVisible,
    setAwayRedModalVisible,
  ] = useState(
    false,
  );

  const liveMinute =
    useMatchClock(
      match,
    );

  const homePlayers =
    match?.homeTeam.players?.length

      ? match.homeTeam.players

      : [

          {

            id:
              'home-player',

            name:
              'Local',
          },

          {

            id:
              'home-efmg',

            name:
              'EFMG',
          },
        ];

  const awayPlayers =
    match?.awayTeam.players?.length

      ? match.awayTeam.players

      : [

          {

            id:
              'visitante-player',

            name:
              'Visitante',
          },

          {

            id:
              'visitante-efmg',

            name:
              'EFMG',
          },
        ];

  /* PERMISSIONS */

  useEffect(
    () => {

      if (
        !canControlMatches
      ) {

        router.replace(
          '/matches',
        );
      }
    },

    [
      canControlMatches,
    ],
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

  if (
    !canControlMatches
  ) {

    return null;
  }

  async function handleStartMatch() {

    if (
      !match
    ) {
      return;
    }

    try {

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

      Alert.alert(
        'Error',
        'No se pudo iniciar el partido.',
      );
    }
  }

  async function handleResumeMatch() {

    if (
      !match
    ) {
      return;
    }

    try {

      await resumeMatchService({

        matchId:
          match.id,
      });

    } catch (
      error
    ) {

      console.log(
        'handleResumeMatch error:',
        error,
      );
    }
  }

  async function handleFinishMatch() {

    if (
      !match
    ) {
      return;
    }

    try {

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

      Alert.alert(
        'Error',
        'No se pudo finalizar el partido.',
      );
    }
  }

  async function handleHalftime() {

    if (
      !match
    ) {
      return;
    }

    try {

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
    }
  }

  async function handleHomeGoal(
    player: MatchPlayer,
  ) {

    if (
      !match
    ) {
      return;
    }

    try {

      await addGoalEventService({

        matchId:
          String(
            matchId,
          ),

        side:
          'home',

        minute:
          liveMinute,

        teamId:
          match.homeTeam.id,

        player,
      });

      setGoalModalVisible(
        false,
      );

    } catch (
      error
    ) {

      console.log(
        'handleHomeGoal error:',
        error,
      );

      Alert.alert(
        'Error',
        'No se pudo registrar el gol.',
      );
    }
  }

  async function handleAwayGoal(
    player: MatchPlayer,
  ) {

    if (
      !match
    ) {
      return;
    }

    try {

      await addGoalEventService({

        matchId:
          match.id,

        side:
          'away',

        minute:
          liveMinute,

        teamId:
          match.awayTeam.id,

        player,
      });

      setAwayGoalModalVisible(
        false,
      );

    } catch (
      error
    ) {

      console.log(
        'handleAwayGoal error:',
        error,
      );
    }
  }

  async function handleYellowCard(
    player: MatchPlayer,
  ) {

    if (
      !match
    ) {
      return;
    }

    try {

      await addCardEventService({

        matchId:
          match.id,

        type:
          'yellow_card',

        side:
          'home',

        minute:
          liveMinute,

        teamId:
          match.homeTeam.id,

        player,
      });

      setYellowModalVisible(
        false,
      );

    } catch (
      error
    ) {

      console.log(
        'handleYellowCard error:',
        error,
      );
    }
  }

  async function handleAwayYellowCard(
    player: MatchPlayer,
  ) {

    if (
      !match
    ) {
      return;
    }

    try {

      await addCardEventService({

        matchId:
          match.id,

        type:
          'yellow_card',

        side:
          'away',

        minute:
          liveMinute,

        teamId:
          match.awayTeam.id,

        player,
      });

      setAwayYellowModalVisible(
        false,
      );

    } catch (
      error
    ) {

      console.log(
        'handleAwayYellowCard error:',
        error,
      );
    }
  }

  async function handleRedCard(
    player: MatchPlayer,
  ) {

    if (
      !match
    ) {
      return;
    }

    try {

      await addCardEventService({

        matchId:
          match.id,

        type:
          'red_card',

        side:
          'home',

        minute:
          liveMinute,

        teamId:
          match.homeTeam.id,

        player,
      });

      setRedModalVisible(
        false,
      );

    } catch (
      error
    ) {

      console.log(
        'handleRedCard error:',
        error,
      );
    }
  }

  async function handleAwayRedCard(
    player: MatchPlayer,
  ) {

    if (
      !match
    ) {
      return;
    }

    try {

      await addCardEventService({

        matchId:
          match.id,

        type:
          'red_card',

        side:
          'away',

        minute:
          liveMinute,

        teamId:
          match.awayTeam.id,

        player,
      });

      setAwayRedModalVisible(
        false,
      );

    } catch (
      error
    ) {

      console.log(
        'handleAwayRedCard error:',
        error,
      );
    }
  }

  if (
    loading
  ) {

    return (

      <Screen>

        <Header
          title="Control de Partido"

          onBack={() =>
            router.back()
          }
        />

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

        <Header
          title="Control de Partido"

          onBack={() =>
            router.back()
          }
        />

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

      <Header
        title="Control de Partido"

        onBack={() =>
          router.back()
        }
      />

      <ScrollView
        contentContainerStyle={{

          padding:
            SPACING.md,

          paddingBottom:
            SPACING.xxl,

          gap:
            SPACING.lg,
        }}
      >

        <View
          style={{

            backgroundColor:
              COLORS.surface,

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
                SPACING.md,
            }}
          >
            {match.category?.name}
          </Text>

          <View
            style={{
              gap:
                SPACING.md,
            }}
          >

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
                }}
              >
                {match.homeTeam.name}
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
                }}
              >
                {match.awayTeam.name}
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

          <Text
            style={{

              color:
                match.status ===
                  'live'
                  ? COLORS.success
                  : COLORS.textSecondary,

              marginTop:
                SPACING.lg,

              fontWeight:
                '800',

              fontSize:
                TYPOGRAPHY.body,
            }}
          >

            {
              match.status ===
                'live'

                ? `🟢 EN VIVO ${liveMinute}'`

                : match.status ===
                  'halftime'

                  ? '⏸ ENTRETIEMPO'

                  : match.status ===
                    'finished'

                    ? 'FINAL'

                    : 'PROGRAMADO'
            }

          </Text>

        </View>

        {
          match.status ===
          'scheduled' && (

            <Pressable

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
                    '#fff',

                  fontWeight:
                    '800',
                }}
              >
                Iniciar Partido
              </Text>

            </Pressable>
          )
        }

        {
          (
            match.status ===
              'live'

            ||

            match.status ===
              'halftime'
          ) && (

            <View
              style={{
                gap:
                  SPACING.md,
              }}
            >

              {/* GOLES */}

              <Pressable

                onPress={() =>
                  setGoalModalVisible(
                    true,
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

                    fontWeight:
                      '800',
                  }}
                >
                  Gol Local
                </Text>

              </Pressable>

              <Pressable

                onPress={() =>
                  setAwayGoalModalVisible(
                    true,
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

                    fontWeight:
                      '800',
                  }}
                >
                  Gol Visitante
                </Text>

              </Pressable>

              {/* AMARILLAS */}

              <Pressable

                onPress={() =>
                  setYellowModalVisible(
                    true,
                  )
                }

                style={{

                  backgroundColor:
                    '#eab308',

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
                      '#000',

                    fontWeight:
                      '800',
                  }}
                >
                  Amarilla Local
                </Text>

              </Pressable>

              <Pressable

                onPress={() =>
                  setAwayYellowModalVisible(
                    true,
                  )
                }

                style={{

                  backgroundColor:
                    '#eab308',

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
                      '#000',

                    fontWeight:
                      '800',
                  }}
                >
                  Amarilla Visitante
                </Text>

              </Pressable>

              {/* ROJAS */}

              <Pressable

                onPress={() =>
                  setRedModalVisible(
                    true,
                  )
                }

                style={{

                  backgroundColor:
                    '#dc2626',

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
                      '#fff',

                    fontWeight:
                      '800',
                  }}
                >
                  Roja Local
                </Text>

              </Pressable>

              <Pressable

                onPress={() =>
                  setAwayRedModalVisible(
                    true,
                  )
                }

                style={{

                  backgroundColor:
                    '#dc2626',

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
                      '#fff',

                    fontWeight:
                      '800',
                  }}
                >
                  Roja Visitante
                </Text>

              </Pressable>

              {/* MATCH CONTROL */}

              {
                match.status ===
                'live' ? (

                  <Pressable

                    onPress={
                      handleHalftime
                    }

                    style={{

                      backgroundColor:
                        COLORS.surfaceLight,

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
                          COLORS.text,

                        fontWeight:
                          '800',
                      }}
                    >
                      Entretiempo
                    </Text>

                  </Pressable>

                ) : (

                  <Pressable

                    onPress={
                      handleResumeMatch
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
                          '#fff',

                        fontWeight:
                          '800',
                      }}
                    >
                      Iniciar Segundo Tiempo
                    </Text>

                  </Pressable>
                )
              }

              <Pressable

                onPress={
                  handleFinishMatch
                }

                style={{

                  backgroundColor:
                    '#7f1d1d',

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
                      '#fff',

                    fontWeight:
                      '800',
                  }}
                >
                  Finalizar Partido
                </Text>

              </Pressable>

            </View>
          )
        }

      </ScrollView>

      <PlayerSelectModal

        visible={
          goalModalVisible
        }

        players={
          homePlayers
        }

        onClose={() =>
          setGoalModalVisible(
            false,
          )
        }

        onSelectPlayer={
          handleHomeGoal
        }
      />

      <PlayerSelectModal

        visible={
          awayGoalModalVisible
        }

        players={
          awayPlayers
        }

        onClose={() =>
          setAwayGoalModalVisible(
            false,
          )
        }

        onSelectPlayer={
          handleAwayGoal
        }
      />

      <PlayerSelectModal

        visible={
          yellowModalVisible
        }

        players={
          homePlayers
        }

        onClose={() =>
          setYellowModalVisible(
            false,
          )
        }

        onSelectPlayer={
          handleYellowCard
        }
      />

      <PlayerSelectModal

        visible={
          awayYellowModalVisible
        }

        players={
          awayPlayers
        }

        onClose={() =>
          setAwayYellowModalVisible(
            false,
          )
        }

        onSelectPlayer={
          handleAwayYellowCard
        }
      />

      <PlayerSelectModal

        visible={
          redModalVisible
        }

        players={
          homePlayers
        }

        onClose={() =>
          setRedModalVisible(
            false,
          )
        }

        onSelectPlayer={
          handleRedCard
        }
      />

      <PlayerSelectModal

        visible={
          awayRedModalVisible
        }

        players={
          awayPlayers
        }

        onClose={() =>
          setAwayRedModalVisible(
            false,
          )
        }

        onSelectPlayer={
          handleAwayRedCard
        }
      />

    </Screen>
  );
}