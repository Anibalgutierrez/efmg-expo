import {
  View,
} from 'react-native';

import AppText
from './AppText';

import {
  SPACING,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {
  title: string;
};

export default function EmptyState({
  title,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{

        paddingVertical:
          SPACING.xl,

        alignItems:
          'center',
      }}
    >

      <AppText
        style={{

          color:
            COLORS.textSecondary,
        }}
      >
        {title}
      </AppText>

    </View>
  );
}