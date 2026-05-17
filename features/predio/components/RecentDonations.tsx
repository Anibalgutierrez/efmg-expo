import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import useTheme
from '../../../hooks/useTheme';

import {
  RADIUS,
  SPACING,
  TYPOGRAPHY,
} from '../../../theme';

import {
  PredioDonation,
} from '../types/predio.types';

type Props = {
  donations: PredioDonation[];
};

export default function RecentDonations({
  donations,
}: Props) {

  const {
    COLORS,
  } = useTheme();

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

      <Text
        style={[
          styles.title,
          {
            color:
              COLORS.text,
          },
        ]}
      >
        Últimos aportes
      </Text>

      {donations.map((donation) => (

        <View
          key={donation.id}
          style={styles.item}
        >

          <Text
            style={[
              styles.name,
              {
                color:
                  COLORS.text,
              },
            ]}
          >
            {donation.nombreDonador}
          </Text>

          <Text
            style={[
              styles.amount,
              {
                color:
                  COLORS.success,
              },
            ]}
          >
            $
            {donation.monto.toLocaleString(
              'es-AR'
            )}
          </Text>

        </View>

      ))}

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

  title: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },

  name: {
    fontSize: TYPOGRAPHY.body,
  },

  amount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
  },

});