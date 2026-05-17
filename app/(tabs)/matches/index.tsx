import {
  ScrollView,
  Text,
  View,
  Pressable,
} from 'react-native';

import {
  FlashList,
} from '@shopify/flash-list';

import Screen
from '../../../components/ui/Screen';

import useTheme
from '../../../hooks/useTheme';

import useMatches
from '../../../features/matches/hooks/useMatches';

import MatchCard
from '../../../features/matches/components/MatchCard';

import {
  useMatchesStore,
  MatchFilter,
} from '../../../features/matches/store/matches.store';

import {
  SPACING,
} from '../../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../../theme/typography';

import {
  RADIUS,
} from '../../../theme/radius';

const FILTERS: {
  label: string;
  value: MatchFilter;
}[] = [

  {
    label: 'Todos',
    value: 'all',
  },

  {
    label: 'En Vivo',
    value: 'live',
  },

  {
    label: 'Hoy',
    value: 'today',
  },

  {
    label: 'Próximos',
    value: 'upcoming',
  },

  {
    label: 'Finalizados',
    value: 'finished',
  },
];

export default function MatchesScreen() {

  const {
    COLORS,
  } = useTheme();

  const {

    matches,

    refreshing,

    loadMoreMatches,

    refreshMatches,

  } = useMatches();

  const {

    selectedFilter,

    setFilter,

  } = useMatchesStore();

  const filteredMatches =
    matches.filter(
      (
        match,
      ) => {

        switch (
          selectedFilter
        ) {

          case 'live':
            return (
              match.status ===
              'live'
            );

          case 'finished':
            return (
              match.status ===
              'finished'
            );

          case 'today': {

            const today =
              new Date();

            const matchDate =
              new Date(
                match.scheduledAt
                  ?.seconds
                  ? match.scheduledAt.seconds *
                      1000
                  : match.scheduledAt,
              );

            return (
              today.toDateString() ===
              matchDate.toDateString()
            );
          }

          case 'upcoming':
            return (
              match.status ===
              'scheduled'
            );

          default:
            return true;
        }
      },
    );

  return (

    <Screen>

      <View
        style={{
          flex: 1,
        }}
      >

        <View
          style={{
            paddingHorizontal:
              SPACING.md,

            paddingTop:
              SPACING.sm,

            marginBottom:
              SPACING.md,
          }}
        >

          <Text
            style={{

              color:
                COLORS.text,

              fontSize:
                TYPOGRAPHY.subtitle,

              fontWeight:
                '800',
            }}
          >
            Partidos
          </Text>

        </View>

        <ScrollView

          horizontal

          showsHorizontalScrollIndicator={
            false
          }

          contentContainerStyle={{
            paddingHorizontal:
              SPACING.md,

            gap:
              SPACING.sm,

            paddingBottom:
              SPACING.md,
          }}
        >

          {FILTERS.map(
            (
              filter,
            ) => {

              const isActive =
                selectedFilter ===
                filter.value;

              return (

                <Pressable

                  key={
                    filter.value
                  }

                  onPress={() =>
                    setFilter(
                      filter.value,
                    )
                  }

                  style={{

                    backgroundColor:
                      isActive
                        ? COLORS.primary
                        : COLORS.surfaceLight,

                    paddingHorizontal:
                      SPACING.md,

                    paddingVertical: 10,

                    borderRadius:
                      RADIUS.full,
                  }}
                >

                  <Text
                    style={{

                      color:
                        isActive
                          ? COLORS.buttonText
                          : COLORS.textSecondary,

                      fontWeight:
                        '700',
                    }}
                  >
                    {filter.label}
                  </Text>

                </Pressable>
              );
            },
          )}

        </ScrollView>

        <FlashList

          data={
            filteredMatches
          }

          keyExtractor={(
            item,
          ) => item.id}

          renderItem={({
            item,
          }) => (
            <MatchCard
              match={item}
            />
          )}

          estimatedItemSize={
            180
          }

          onEndReached={
            loadMoreMatches
          }

          onEndReachedThreshold={
            0.3
          }

          refreshing={
            refreshing
          }

          onRefresh={
            refreshMatches
          }

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={{

            paddingHorizontal:
              SPACING.md,

            paddingBottom: 120,
          }}

          ListEmptyComponent={

            <View
              style={{

                paddingTop: 120,

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
                }}
              >
                No hay partidos
              </Text>

            </View>
          }
        />

      </View>

    </Screen>
  );
}