import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import useTheme
from '../../../hooks/useTheme';

import {
  RADIUS,
} from '../../../theme';

type Props = {
  percentage: number;
};

export default function PredioProgressBar({
  percentage,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={[
        styles.track,
        {
          backgroundColor:
            COLORS.surfaceLight,
        },
      ]}
    >

      <View
        style={[
          styles.fill,
          {
            backgroundColor:
              COLORS.success,
            width: `${percentage}%`,
          },
        ]}
      />

    </View>

  );
}

const styles = StyleSheet.create({

  track: {
    width: '100%',
    height: 12,
    borderRadius:
      RADIUS.full,
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    borderRadius:
      RADIUS.full,
  },

});