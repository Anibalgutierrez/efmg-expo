import {
  Image,
  Text,
  View,
} from 'react-native';

import useTheme
  from '../../../hooks/useTheme';

import {
  Match,
} from '../types/match.types';

import {
  MatchEvent,
} from '../types/match-event.types';

import {
  SPACING,
} from '../../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../../theme/typography';

import {
  RADIUS,
} from '../../../theme/radius';

type Props = {
  events?: MatchEvent[];

  match?: Match | null;
};

export default function MatchTimeline({
  events = [],
  match = null,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  function getEventIcon(
    type: MatchEvent['type'],
  ) {

    switch (
    type
    ) {

      case 'goal':
        return '⚽';

      case 'yellow_card':
        return '🟨';

      case 'red_card':
        return '🟥';

      case 'substitution':
        return '🔄';

      case 'halftime':
        return '⏸';

      case 'match_started':
        return '🟢';

      case 'match_finished':
        return '🏁';

      default:
        return '•';
    }
  }

  function getEventLabel(
    event: MatchEvent,
  ) {

    switch (
    event.type
    ) {

      case 'goal':
        return event.player?.name
          || 'Gol';

      case 'yellow_card':
        return event.player?.name
          || 'Tarjeta amarilla';

      case 'red_card':
        return event.player?.name
          || 'Tarjeta roja';

      case 'substitution':
        return event.player?.name
          || 'Cambio';

      case 'halftime':
        return 'ENTRETIEMPO';

      case 'match_started':
        return 'COMENZÓ EL PARTIDO';

      case 'match_finished':
        return 'FINAL DEL PARTIDO';

      default:
        return 'Evento';
    }
  }

  function isCenterEvent(
    type: MatchEvent['type'],
  ) {

    return (

      type ===
      'match_started'

      ||

      type ===
      'halftime'

      ||

      type ===
      'match_finished'
    );
  }

  if (
    events.length === 0
  ) {

    return (

      <Text
        style={{
          color:
            COLORS.textSecondary,
        }}
      >
        Todavía no hay eventos.
      </Text>
    );
  }

  return (

    <View
      style={{
        gap:
          SPACING.md,
      }}
    >

      {[...events]
        .reverse()
        .map(
          (
            event,
          ) => {

            const centerEvent =
              isCenterEvent(
                event.type,
              );

            const isHome =
              event.teamSide ===
              'home';

            const rawLogo =

              isHome

                ? match?.homeTeam?.logo

                : match?.awayTeam?.logo;

            const teamLogo =

              typeof rawLogo === 'string' &&
                rawLogo.trim().length > 0

                ? rawLogo

                : null;

            return (

              <View
                key={
                  event.id || `${event.type}-${event.minute}`
                }
              >

                {/* CENTER EVENTS */}

                {
                  centerEvent && (

                    <View
                      style={{

                        alignItems:
                          'center',
                      }}
                    >

                      <View
                        style={{

                          backgroundColor:
                            COLORS.surfaceLight,

                          paddingHorizontal:
                            SPACING.md,

                          paddingVertical:
                            SPACING.sm,

                          borderRadius:
                            RADIUS.full,

                          flexDirection:
                            'row',

                          alignItems:
                            'center',

                          gap:
                            SPACING.sm,
                        }}
                      >

                        <Text
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {getEventIcon(
                            event.type,
                          )}
                        </Text>

                        <Text
                          style={{

                            color:
                              COLORS.text,

                            fontWeight:
                              '800',

                            fontSize:
                              TYPOGRAPHY.caption,
                          }}
                        >
                          {getEventLabel(
                            event,
                          )}
                        </Text>

                      </View>

                    </View>
                  )
                }

                {/* SIDE EVENTS */}

                {
                  !centerEvent && (

                    <View
                      style={{

                        flexDirection:
                          'row',

                        justifyContent:
                          isHome
                            ? 'flex-start'
                            : 'flex-end',
                      }}
                    >

                      <View
                        style={{

                          width:
                            '82%',

                          backgroundColor:
                            COLORS.surfaceLight,

                          borderRadius:
                            RADIUS.lg,

                          padding:
                            SPACING.md,

                          flexDirection:
                            'row',

                          alignItems:
                            'center',

                          justifyContent:
                            'space-between',

                          borderLeftWidth:
                            isHome
                              ? 4
                              : 0,

                          borderRightWidth:
                            !isHome
                              ? 4
                              : 0,

                          borderColor:

                            event.type ===
                              'goal'

                              ? COLORS.success

                              : event.type ===
                                'red_card'

                                ? COLORS.danger

                                : COLORS.primary,
                        }}
                      >

                        <View
                          style={{

                            flexDirection:
                              'row',

                            alignItems:
                              'center',

                            flex: 1,
                          }}
                        >

                          {
                            teamLogo ? (

                              <Image
                                source={{
                                  uri:
                                    teamLogo,
                                }}
                                style={{

                                  width: 28,

                                  height: 28,

                                  borderRadius: 14,

                                  marginRight:
                                    SPACING.sm,
                                }}
                              />

                            ) : (

                              <View
                                style={{

                                  width: 28,

                                  height: 28,

                                  borderRadius: 14,

                                  marginRight:
                                    SPACING.sm,

                                  backgroundColor:
                                    COLORS.surface,

                                  alignItems:
                                    'center',

                                  justifyContent:
                                    'center',
                                }}
                              >

                                <Text
                                  style={{
                                    fontSize: 14,
                                  }}
                                >
                                  {
                                    isHome
                                      ? '🏠'
                                      : '✈️'
                                  }
                                </Text>

                              </View>
                            )
                          }

                          <Text
                            style={{

                              fontSize: 20,

                              marginRight:
                                SPACING.sm,
                            }}
                          >
                            {getEventIcon(
                              event.type,
                            )}
                          </Text>

                          <View
                            style={{
                              flex: 1,
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
                              {getEventLabel(
                                event,
                              )}
                            </Text>

                            {
                              event.description && (

                                <Text
                                  style={{

                                    color:
                                      COLORS.textSecondary,

                                    marginTop: 2,

                                    fontSize:
                                      TYPOGRAPHY.caption,
                                  }}
                                >
                                  {event.description}
                                </Text>
                              )
                            }

                          </View>

                        </View>

                        <Text
                          style={{

                            color:
                              COLORS.textSecondary,

                            fontWeight:
                              '800',

                            marginLeft:
                              SPACING.sm,

                            fontSize:
                              TYPOGRAPHY.body,
                          }}
                        >
                          {event.minute}'
                        </Text>

                      </View>

                    </View>
                  )
                }

              </View>
            );
          },
        )}

    </View>
  );
}