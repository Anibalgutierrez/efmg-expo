import {
  useEffect,
  useState,
} from 'react';

import {
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import Screen
from '../../../components/ui/Screen';

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
import Header from '@/components/ui/Header';

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

  useEffect(
    () => {

      const unsubscribe =
        subscribeMatchesService(
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

    [],
  );

  return (

    <Screen>

            <Header title="Partidos" />
      

      {/* CREATE BUTTON */}

      {
        canControlMatches && (

          <Pressable

            onPress={() =>
              router.push(
                '/matches/create',
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

      {/* CONTENT */}

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

            data={matches}

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