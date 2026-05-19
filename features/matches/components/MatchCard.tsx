import {
  memo,
} from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import useMatchClock
from '../hooks/useMatchClock';

import useTheme
from '../../../hooks/useTheme';

import {
  Match,
} from '../types/match.types';

import {
  RADIUS,
} from '../../../theme/radius';

import {
  SPACING,
} from '../../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../../theme/typography';

type Props = {
  match: Match;
};

function MatchCard({
  match,
}: Props) {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const liveMinute =
    useMatchClock(
      match,
    );

  const renderStatus =
    () => {

      switch (
        match.status
      ) {

        case 'live':
          return (
            <View
              style={{
                backgroundColor:
                  'rgba(34,197,94,0.15)',

                paddingHorizontal:
                  SPACING.sm,

                paddingVertical: 6,

                borderRadius:
                  RADIUS.full,

                alignSelf:
                  'flex-start',
              }}
            >

              <Text
                style={{
                  color:
                    COLORS.success,

                  fontWeight:
                    '700',

                  fontSize:
                    TYPOGRAPHY.caption,
                }}
              >
                🟢 EN VIVO {liveMinute}'
              </Text>

            </View>
          );

        case 'halftime':
          return (
            <Text
              style={{
                color:
                  COLORS.primary,

                fontWeight:
                  '700',
              }}
            >
              ⏸ DESCANSO
            </Text>
          );

        case 'finished':
          return (
            <Text
              style={{
                color:
                  COLORS.textSecondary,

                fontWeight:
                  '700',
              }}
            >
              FINAL
            </Text>
          );

        default:

          return (

            <Text
              style={{
                color:
                  COLORS.textSecondary,

                fontWeight:
                  '600',
              }}
            >

             {
  (() => {

    const date =
      match.scheduledAt
        ?.toDate?.();

    if (
      !date
    ) {
      return '';
    }

    const formattedDate =
      date.toLocaleDateString(
        'es-AR',
        {

          weekday:
            'short',

          day:
            'numeric',

          month:
            'short',
        },
      );

    const formattedTime =
      date.toLocaleTimeString(
        'es-AR',
        {

          hour:
            '2-digit',

          minute:
            '2-digit',
        },
      );

    return `${formattedDate} · ${formattedTime}`;
  })()
}

            </Text>
          );
      }
    };

  return (

    <Pressable

      onPress={() =>
        router.push(
          `/match/${match.id}`,
        )
      }

      style={{

        backgroundColor:
          COLORS.surface,

        borderRadius:
          RADIUS.lg,

        padding:
          SPACING.md,

        marginBottom:
          SPACING.md,
      }}
    >

      <Text
        style={{

          color:
            COLORS.textSecondary,

          fontSize:
            TYPOGRAPHY.caption,

          marginBottom:
            SPACING.sm,

          fontWeight:
            '600',
        }}
      >
        {match.category?.name ||
          'Sin categoría'}
      </Text>

      <View
        style={{
          gap: SPACING.sm,
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

              flex: 1,
            }}
            numberOfLines={1}
          >
            {match.homeTeam.name}
          </Text>

          <Text
            style={{

              color:
                COLORS.text,

              fontSize: 34,

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

              flex: 1,
            }}
            numberOfLines={1}
          >
            {match.awayTeam.name}
          </Text>

          <Text
            style={{

              color:
                COLORS.text,

              fontSize: 34,

              fontWeight:
                '800',
            }}
          >
            {match.scoreAway}
          </Text>

        </View>

      </View>

      <View
        style={{
          marginTop:
            SPACING.md,
        }}
      >
        {renderStatus()}
      </View>

      <Text
        style={{

          color:
            COLORS.textSecondary,

          marginTop:
            SPACING.sm,

          fontSize:
            TYPOGRAPHY.caption,
        }}
      >
        {match.venue}
      </Text>

    </Pressable>
  );
}

export default memo(
  MatchCard,
);