import {
  View,
  Text,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

export default function MatchesScreen() {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{
        flex: 1,

        backgroundColor:
          COLORS.background,

        justifyContent:
          'center',

        alignItems:
          'center',
      }}
    >

      <Text
        style={{
          color:
            COLORS.text,
        }}
      >
        Matches
      </Text>

    </View>
  );
}