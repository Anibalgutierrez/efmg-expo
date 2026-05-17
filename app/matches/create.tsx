import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import Screen
from '../../components/ui/Screen';

import Input
from '../../components/ui/Input';

import Button
from '../../components/ui/Button';

import SelectorCard
from '../../components/ui/SelectorCard';

import useTheme
from '../../hooks/useTheme';

import {
  Team,
} from '../../features/teams/types/team.types';

import {
  Category,
} from '../../features/categories/types/category.types';

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

export default function CreateMatchScreen() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const [
    teams,
    setTeams,
  ] = useState<Team[]>([]);

  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

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
    scheduledAt,
    setScheduledAt,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

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
      !homeTeam ||
      !awayTeam ||
      !category ||
      !venue ||
      !scheduledAt
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

    try {

      setLoading(
        true,
      );

      await createMatchService({

        homeTeam,

        awayTeam,

        category,

        venue,

        scheduledAt:
          new Date(
            scheduledAt,
          ),
      });

      Alert.alert(
        'Partido creado',
        'El partido fue creado correctamente.',
      );

      router.back();

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

  return (

    <Screen>

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

        {/* CATEGORY */}

        <View
          style={{
            gap: SPACING.sm,
          }}
        >

          <Text
            style={{
              color:
                COLORS.text,
              fontWeight:
                '700',
            }}
          >
            Categorías
          </Text>

          {
            categories.map(
              (
                item,
              ) => (

                <SelectorCard
                  key={item.id}
                  label={item.name}
                  value={
                    category?.id ===
                    item.id
                      ? 'Seleccionada'
                      : undefined
                  }
                  placeholder={
                    item.name
                  }
                  onPress={() =>
                    setCategory(
                      item,
                    )
                  }
                />
              ),
            )
          }

        </View>

        {/* HOME TEAM */}

        <View
          style={{
            gap: SPACING.sm,
          }}
        >

          <Text
            style={{
              color:
                COLORS.text,
              fontWeight:
                '700',
            }}
          >
            Equipo Local
          </Text>

          {
            teams.map(
              (
                item,
              ) => (

                <SelectorCard
                  key={item.id}
                  label={item.name}
                  value={
                    homeTeam?.id ===
                    item.id
                      ? 'Seleccionado'
                      : undefined
                  }
                  placeholder={
                    item.name
                  }
                  onPress={() =>
                    setHomeTeam(
                      item,
                    )
                  }
                />
              ),
            )
          }

        </View>

        {/* AWAY TEAM */}

        <View
          style={{
            gap: SPACING.sm,
          }}
        >

          <Text
            style={{
              color:
                COLORS.text,
              fontWeight:
                '700',
            }}
          >
            Equipo Visitante
          </Text>

          {
            teams.map(
              (
                item,
              ) => (

                <SelectorCard
                  key={item.id}
                  label={item.name}
                  value={
                    awayTeam?.id ===
                    item.id
                      ? 'Seleccionado'
                      : undefined
                  }
                  placeholder={
                    item.name
                  }
                  onPress={() =>
                    setAwayTeam(
                      item,
                    )
                  }
                />
              ),
            )
          }

        </View>

        {/* VENUE */}

        <Input
          label="Cancha"
          placeholder="Cancha 1"
          value={venue}
          onChangeText={
            setVenue
          }
        />

        {/* DATE */}

        <Input
          label="Fecha y Hora"
          placeholder="2026-05-17T18:00:00"
          value={scheduledAt}
          onChangeText={
            setScheduledAt
          }
        />

        {/* BUTTON */}

        <Button
          title="Crear Partido"
          onPress={
            handleCreateMatch
          }
          loading={loading}
        />

      </ScrollView>

    </Screen>
  );
}