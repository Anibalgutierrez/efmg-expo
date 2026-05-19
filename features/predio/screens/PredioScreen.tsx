// features/predio/screens/PredioScreen.tsx

import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import usePredio
  from '../hooks/usePredio';

import Screen
  from '../../../components/ui/Screen';

import useTheme
  from '../../../hooks/useTheme';

import RecentDonations
  from '../components/RecentDonations';

import {
  SPACING,
  TYPOGRAPHY,
  RADIUS,
} from '../../../theme';

import PredioGrid
  from '../components/PredioGrid';

import {
  mockPredioStats,
} from '../constants/mockPredioData';

// actualizar PredioScreen.tsx

import PredioStatsCard
  from '../components/PredioStatsCard';

import QuickDonateButtons
  from '../components/QuickDonateButtons';
import Header from '@/components/ui/Header';

export function PredioScreen() {

  const {
    COLORS,
  } = useTheme();

  const {
    stats,
    donations,
    completedSquares,
    percentage,
  } = usePredio();

  return (

    <Screen>

      <Header title="Nuestra Casa" />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        <View
          style={[
            styles.hero,
            {
              backgroundColor:
                COLORS.surface,
              borderColor:
                COLORS.border,
            },
          ]}
        >

          <Text
            style={[
              styles.title,
              {
                color:
                  COLORS.text,
              },
            ]}
          >
            Predio EFMG
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  COLORS.textSecondary,
              },
            ]}
          >
            La comunidad ya completó{' '}
            {completedSquares}m²
          </Text>

          <Text
            style={[
              styles.progress,
              {
                color:
                  COLORS.success,
              },
            ]}
          >
            {percentage}% completado
          </Text>

        </View>

        <View
          style={[
            styles.gridContainer,
            {
              backgroundColor:
                COLORS.surface,
              borderColor:
                COLORS.border,
            },
          ]}
        >

          <PredioGrid
            completedSquares={
              completedSquares
            }
          />

          <PredioStatsCard
            totalRaised={
              stats.totalRaised
            }
            totalGoal={
              stats.totalGoal
            }
            completedSquares={
              completedSquares
            }
          />

          <QuickDonateButtons />
          
<RecentDonations
  donations={donations}
/>
        </View>

      </ScrollView>

    </Screen>

  );
}

const styles = StyleSheet.create({

  content: {
    padding:
      SPACING.md,
    paddingBottom:
      SPACING.xxl,
  },

  hero: {
    padding:
      SPACING.lg,
    borderRadius:
      RADIUS.lg,
    borderWidth: 1,
    marginBottom:
      SPACING.lg,
  },

  title: {
    fontSize:
      TYPOGRAPHY.title,
    fontWeight: '700',
  },

  subtitle: {
    fontSize:
      TYPOGRAPHY.body,
    marginTop:
      SPACING.sm,
  },

  progress: {
    fontSize:
      TYPOGRAPHY.subtitle,
    fontWeight: '700',
    marginTop:
      SPACING.md,
  },

  gridContainer: {
    padding:
      SPACING.md,
    borderRadius:
      RADIUS.lg,
    borderWidth: 1,
  },

});