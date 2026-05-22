import {
  ReactNode,
} from 'react';

import {
  View,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import useTheme
from '../../hooks/useTheme';

type Props = {
  children: ReactNode;
};

const MAX_WIDTH =
  660;

export default function Screen({
  children,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          COLORS.background,
      }}
    >

      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >

        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: MAX_WIDTH,
          }}
        >

          {children}

        </View>

      </View>

    </SafeAreaView>
  );
}