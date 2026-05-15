import {
  ReactNode,
} from 'react';

import {
  View,
} from 'react-native';

import {
  RADIUS,
  SPACING,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {
  children: ReactNode;
};

export default function Card({
  children,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{

        backgroundColor:
          COLORS.surface,

        borderRadius:
          RADIUS.lg,

        padding:
          SPACING.md,

        marginBottom:
          SPACING.md,

        borderWidth: 1,

        borderColor:
          COLORS.border,
      }}
    >
      {children}
    </View>
  );
}