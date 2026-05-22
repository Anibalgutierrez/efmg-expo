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

export default function InfoPredioCard() {

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
        Nuestro predio
      </Text>

      <Text
        style={[
          styles.text,
          {
            color:
              COLORS.textSecondary,
          },
        ]}
      >
        📍 Juan XXIII 740 - Villa Bosch
      </Text>

      <Text
        style={[
          styles.text,
          {
            color:
              COLORS.textSecondary,
          },
        ]}
      >
        ⚽ Entrenamos:
      </Text>

<Text
        style={[
          styles.text,
          {
            color:
              COLORS.text,
          },
        ]}
      >
        
        Lunes y Miércoles / 14 años en adelante
      </Text>

      <Text
        style={[
          styles.text,
          {
            color:
              COLORS.text,
          },
        ]}
      >
        Martes y jueves / 8 a 13 años
      </Text>

      <Text
        style={[
          styles.text,
          {
            color:
              COLORS.text,
          },
        ]}
      >
        18:30 a 20:00 hs
      </Text>

      <Text
        style={[
          styles.footer,
          {
            color:
              COLORS.success,
          },
        ]}
      >
        Estamos construyendo juntos
        el futuro de EFMG 💚
      </Text>

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

  text: {
    fontSize: TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },

  footer: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
  },

});