import {
  Image,
  View,
} from 'react-native';

import {
  RADIUS,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {
  uri?: string;
  size?: number;
};

export default function Avatar({
  uri,
  size = 48,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  if (!uri) {

    return (

      <View
        style={{

          width: size,

          height: size,

          borderRadius:
            RADIUS.full,

          backgroundColor:
            COLORS.surfaceLight,
        }}
      />
    );
  }

  return (

    <Image
      source={{ uri }}

      style={{

        width: size,

        height: size,

        borderRadius:
          RADIUS.full,
      }}
    />
  );
}