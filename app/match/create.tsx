import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  Text,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import Screen
  from '../../components/ui/Screen';

import Header
  from '../../components/ui/Header';

import Input
  from '../../components/ui/Input';

import SelectorCard
  from '../../components/ui/SelectorCard';

import SelectModal
  from '../../components/ui/SelectModal';

import useTheme
  from '../../hooks/useTheme';

import useCanControlMatches
  from '../../hooks/useCanControlMatches';

import {
  Team,
} from '../../features/teams/types/team.types';

import {
  Category,
} from '../../features/categories/types/category.types';

import {
  TournamentId,
} from '../../features/matches/types/tournament.types';

import {
  getTeamsService,
} from '../../features/teams/services/get-teams.service';

import {
  getCategoriesService,
} from '../../features/categories/services/get-categories.service';

import {
  createMatchService,
} from '../../features/matches/services/create-match.service';

import {
  SPACING,
} from '../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../theme/typography';

const TOURNAMENTS = [

  {
    id: 'lifat',
    name: 'LIFAT',
  },

  {
    id: 'cemef',
    name: 'CEMEF',
  },

  {
    id: 'cedem',
    name: 'CEDEM',
  },

   {
    id: 'bonaerenses',
    name: 'Juegos Bonaerenses',
  },

  {
    id: 'friendlies',
    name: 'Amistosos',
  },
];

export default function CreateMatchScreen() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const canControlMatches =
    useCanControlMatches();

  const [
    teams,
    setTeams,
  ] = useState<Team[]>(
    [],
  );

  const [
    categories,
    setCategories,
  ] = useState<Category[]>(
    [],
  );

  const [
    tournamentId,
    setTournamentId,
  ] = useState<
    TournamentId | null
  >(
    null,
  );

  const [
    homeTeam,
    setHomeTeam,
  ] = useState<Team | null>(
    null,
  );

  const [
    awayTeam,
    setAwayTeam,
  ] = useState<Team | null>(
    null,
  );

  const [
    category,
    setCategory,
  ] = useState<Category | null>(
    null,
  );

  const [
    venue,
    setVenue,
  ] = useState('');

  const [
    matchDate,
    setMatchDate,
  ] = useState('');

  const [
    matchTime,
    setMatchTime,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* MODALS */

  const [
    tournamentModalVisible,
    setTournamentModalVisible,
  ] = useState(
    false,
  );

  const [
    categoryModalVisible,
    setCategoryModalVisible,
  ] = useState(
    false,
  );

  const [
    homeModalVisible,
    setHomeModalVisible,
  ] = useState(
    false,
  );

  const [
    awayModalVisible,
    setAwayModalVisible,
  ] = useState(
    false,
  );

  /* PROTECTION */

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

  useEffect(
    () => {

      loadData();
    },

    [],
  );

  async function loadData() {

    try {

      const [
        teamsData,
        categoriesData,
      ] = await Promise.all([

        getTeamsService(),

        getCategoriesService(),
      ]);

      setTeams(
        teamsData,
      );

      setCategories(
        categoriesData,
      );

    } catch (
      error
    ) {

      console.log(
        'loadData error:',
        error,
      );
    }
  }

  async function handleCreateMatch() {

    if (
      !tournamentId ||
      !homeTeam ||
      !awayTeam ||
      !category ||
      !venue ||
      !matchDate ||
      !matchTime
    ) {

      Alert.alert(
        'Completar datos',
        'Todos los campos son obligatorios.',
      );

      return;
    }

    if (
      homeTeam.id ===
      awayTeam.id
    ) {

      Alert.alert(
        'Equipos inválidos',
        'Local y visitante no pueden ser iguales.',
      );

      return;
    }

    const normalizedDate =
      matchDate.replaceAll(
        '/',
        '-',
      );

    const finalDate =
      new Date(
        `${normalizedDate}T${matchTime}:00`,
      );

    if (
      isNaN(
        finalDate.getTime(),
      )
    ) {

      Alert.alert(
        'Fecha inválida',
        'Ingresá una fecha y hora válidas.',
      );

      return;
    }

    try {

      setLoading(
        true,
      );

      await createMatchService({

        tournamentId,

        homeTeam,

        awayTeam,

        category,

        venue,

        scheduledAt:
          finalDate,
      });

      Alert.alert(
        'Partido creado',
        'El partido fue creado correctamente.',
      );

      router.replace(
        '/matches',
      );

    } catch (
      error
    ) {

      console.log(
        'handleCreateMatch error:',
        error,
      );

      Alert.alert(
        'Error',
        'No se pudo crear el partido.',
      );

    } finally {

      setLoading(
        false,
      );
    }
  }

  if (
    !canControlMatches
  ) {

    return null;
  }

  return (

    <Screen>

      <Header
        title="Crear"
        onBack={() => {

          if (
            router.canGoBack()
          ) {

            router.back();

          } else {

            router.push(
              '/matches',
            );
          }
        }}
      />

      <ScrollView
        contentContainerStyle={{
          padding:
            SPACING.md,

          gap:
            SPACING.lg,

          paddingBottom:
            SPACING.xxl,
        }}
        showsVerticalScrollIndicator={
          false
        }
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
          Crear Partido
        </Text>

        <SelectorCard

          label="Torneo"

          value={
            TOURNAMENTS.find(
              tournament =>
                tournament.id ===
                tournamentId,
            )?.name
          }

          placeholder="Seleccionar torneo"

          onPress={() =>
            setTournamentModalVisible(
              true,
            )
          }
        />

        <SelectorCard

          label="Categoría"

          value={
            category?.name
          }

          placeholder="Seleccionar categoría"

          onPress={() =>
            setCategoryModalVisible(
              true,
            )
          }
        />

        <SelectorCard

          label="Equipo Local"

          value={
            homeTeam?.name
          }

          placeholder="Seleccionar equipo"

          onPress={() =>
            setHomeModalVisible(
              true,
            )
          }
        />

        <SelectorCard

          label="Equipo Visitante"

          value={
            awayTeam?.name
          }

          placeholder="Seleccionar equipo"

          onPress={() =>
            setAwayModalVisible(
              true,
            )
          }
        />

        <Input
          label="Cancha"
          placeholder="Cancha 1"
          value={venue}
          onChangeText={
            setVenue
          }
        />

        <Input
          label="Fecha"
          placeholder="2026/05/18"
          value={matchDate}
          onChangeText={
            setMatchDate
          }
        />

        <Input
          label="Hora"
          placeholder="18:30"
          value={matchTime}
          onChangeText={
            setMatchTime
          }
        />

        <Pressable

          onPress={
            handleCreateMatch
          }

          style={{

            backgroundColor:
              COLORS.primary,

            padding:
              SPACING.lg,

            borderRadius: 12,

            alignItems:
              'center',
          }}
        >

          <Text
            style={{

              color: '#fff',

              fontWeight:
                '800',
            }}
          >
            {
              loading
                ? 'Creando...'
                : 'Crear Partido'
            }
          </Text>

        </Pressable>

      </ScrollView>

      <SelectModal

        visible={
          tournamentModalVisible
        }

        title="Seleccionar torneo"

        items={
          TOURNAMENTS
        }

        onClose={() =>
          setTournamentModalVisible(
            false,
          )
        }

        onSelect={(
          item,
        ) =>
          setTournamentId(
            item.id as TournamentId,
          )
        }
      />

      <SelectModal

        visible={
          categoryModalVisible
        }

        title="Seleccionar categoría"

        items={
          categories
        }

        onClose={() =>
          setCategoryModalVisible(
            false,
          )
        }

        onSelect={(
          item,
        ) =>
          setCategory(
            item as Category,
          )
        }
      />

      <SelectModal

        visible={
          homeModalVisible
        }

        title="Equipo Local"

        items={
          teams
        }

        onClose={() =>
          setHomeModalVisible(
            false,
          )
        }

        onSelect={(
          item,
        ) =>
          setHomeTeam(
            item as Team,
          )
        }
      />

      <SelectModal

        visible={
          awayModalVisible
        }

        title="Equipo Visitante"

        items={
          teams
        }

        onClose={() =>
          setAwayModalVisible(
            false,
          )
        }

        onSelect={(
          item,
        ) =>
          setAwayTeam(
            item as Team,
          )
        }
      />

    </Screen>
  );
}