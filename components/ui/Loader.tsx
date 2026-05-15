import {
  ActivityIndicator,
  View,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

export default function Loader() {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{
        paddingVertical: 40,
      }}
    >

      <ActivityIndicator
        size="large"
        color={COLORS.primary}
      />

    </View>
  );
}