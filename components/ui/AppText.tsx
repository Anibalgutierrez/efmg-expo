import {
  ReactNode,
} from 'react';

import {
  Text,
  TextStyle,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

type Props = {
  children: ReactNode;
  style?: TextStyle;
};

export default function AppText({
  children,
  style,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Text
      style={[
        {
          color:
            COLORS.text,

          fontSize: 16,
        },

        style,
      ]}
    >

      {children}

    </Text>
  );
}