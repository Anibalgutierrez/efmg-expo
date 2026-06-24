import {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import Screen
from '../../../components/ui/Screen';

import Header
from '@/components/ui/Header';

import useTheme
from '../../../hooks/useTheme';

import useCanControlMatches
from '../../../hooks/useCanControlMatches';

import MatchCard
from '../../../features/matches/components/MatchCard';

import {
  Match,
} from '../../../features/matches/types/match.types';

import {
  TournamentId,
} from '../../../features/matches/types/tournament.types';

import {
  subscribeMatchesService,
} from '../../../features/matches/services/subscribe-matches.service';

import {
  SPACING,
} from '../../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../../theme/typography';

import {
  RADIUS,
} from '../../../theme/radius';

const TOURNAMENTS: {
  id: TournamentId | 'all';
  label: string;
}[] = [

  {
    id: 'all',
    label: 'Todos',
  },

  {
    id: 'lifat',
    label: 'LIFAT',
  },

  {
    id: 'cemef',
    label: 'CEMEF',
  },

  {
    id: 'cedem',
    label: 'CEDEM',
  },

  {
    id: 'bonaerenses',
    label: 'Bonaerenses',
  },

  {
    id: 'friendlies',
    label: 'Amistosos',
  },
];

export default function MatchesScreen() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const canControlMatches =
    useCanControlMatches();

  const [
    matches,
    setMatches,
  ] = useState<Match[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(
    true,
  );

  const [
    selectedTournament,
    setSelectedTournament,
  ] = useState<
    TournamentId | 'all'
  >(
    'all',
  );

  useEffect(
    () => {

      setLoading(
        true,
      );

      const unsubscribe =
        subscribeMatchesService(

          selectedTournament,

          (
            data,
          ) => {

            setMatches(
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
      selectedTournament,
    ],
  );

  return (

    <Screen>

      <Header
        title="Partidos"
      />

      {

        canControlMatches && (

          <Pressable

            onPress={() =>
              router.push(
                '/match/create',
              )
            }

            style={{

              backgroundColor:
                COLORS.primary,

              margin:
                SPACING.md,

              borderRadius:
                RADIUS.lg,

              padding:
                SPACING.md,

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

                fontSize:
                  TYPOGRAPHY.body,
              }}
            >
              + Crear Partido
            </Text>

          </Pressable>
        )
      }

<View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  }}
>
  {TOURNAMENTS.map((tournament) => {
    const active = selectedTournament === tournament.id;

    return (
      <Pressable
        key={tournament.id}
        onPress={() => setSelectedTournament(tournament.id)}
        style={{
          minHeight: 38,
          paddingHorizontal: SPACING.md,
          paddingVertical: 8,
          borderRadius: RADIUS.full,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: active ? COLORS.primary : COLORS.surface,
          borderWidth: active ? 0 : 1,
          borderColor: COLORS.border,
        }}
      >
        <Text
          style={{
            color: active ? '#fff' : COLORS.text,
            fontWeight: '700',
            fontSize: TYPOGRAPHY.caption,
            textAlign: 'center',
          }}
        >
          {tournament.label}
        </Text>
      </Pressable>
    );
  })}
</View>

      {

        loading ? (

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
              Cargando partidos...
            </Text>

          </View>

        ) : matches.length ===
          0 ? (

          <View
            style={{

              flex: 1,

              justifyContent:
                'center',

              alignItems:
                'center',

              padding:
                SPACING.xl,
            }}
          >

            <Text
              style={{

                color:
                  COLORS.textSecondary,

                fontSize:
                  TYPOGRAPHY.body,

                textAlign:
                  'center',
              }}
            >
              No hay partidos cargados.
            </Text>

          </View>

        ) : (

          <FlatList

            data={
              matches
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

            contentContainerStyle={{

              paddingHorizontal:
                SPACING.md,

              paddingBottom:
                SPACING.xxl,
            }}

            showsVerticalScrollIndicator={
              false
            }
          />
        )
      }

    </Screen>
  );
}