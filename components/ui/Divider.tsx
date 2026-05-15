import {
  View,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

export default function Divider() {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{
        height: 1,

        backgroundColor:
          COLORS.border,
      }}
    />

  );
}