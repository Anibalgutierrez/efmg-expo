// features/predio/components/PredioStatsCard.tsx

import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import PredioProgressBar
from './PredioProgressBar';

import useTheme
from '../../../hooks/useTheme';

import {
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../../theme';


type Props = {
  totalRaised: number;
  totalGoal: number;
  completedSquares: number;
};

export default function PredioStatsCard({
  totalRaised,
  totalGoal,
  completedSquares,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  const percentage =
  Number(
    (
      (totalRaised / totalGoal) * 100
    ).toFixed(1)
  );

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor:
            COLORS.surface,
          borderColor:
            COLORS.border,
        },
      ]}
    >

      <View style={styles.row}>

        <View style={styles.item}>

          <Text
            style={[
              styles.label,
              {
                color:
                  COLORS.textSecondary,
              },
            ]}
          >
            Recaudado
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  COLORS.text,
              },
            ]}
          >
            $
            {totalRaised.toLocaleString(
              'es-AR'
            )}
          </Text>

        </View>

        <View style={styles.item}>

          <Text
            style={[
              styles.label,
              {
                color:
                  COLORS.textSecondary,
              },
            ]}
          >
            Objetivo
          </Text>

          <Text
            style={[
              styles.value,
              {
                color:
                  COLORS.text,
              },
            ]}
          >
            $
            {totalGoal.toLocaleString(
              'es-AR'
            )}
          </Text>

        </View>

      </View>

        <View style={styles.progressContainer}>

  <PredioProgressBar
    percentage={percentage}
  />

</View>

      <View style={styles.bottom}>

      

        <Text
          style={[
            styles.completed,
            {
              color:
                COLORS.success,
            },
          ]}
        >
          {completedSquares}m² completados
        </Text>

        <Text
          style={[
            styles.percent,
            {
              color:
                COLORS.text,
            },
          ]}
        >
          {percentage}%
        </Text>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  item: {
    flex: 1,
  },

  label: {
    fontSize: TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },

  value: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
  },

  bottom: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  completed: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
  },

  percent: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
  },

  progressContainer: {
  marginTop: SPACING.md,
},

});