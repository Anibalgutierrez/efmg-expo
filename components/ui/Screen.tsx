import {
  ReactNode,
} from 'react';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import useTheme
from '../../hooks/useTheme';

type Props = {
  children: ReactNode;
};

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

      {children}

    </SafeAreaView>
  );
}