import {
  Text,
  TextProps,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

type Props =
  TextProps & {
    children:
      React.ReactNode;

    style?: any;
  };

export default function AppText({
  children,
  style,
  ...props
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Text
      {...props}

      style={[

        {
          color:
            COLORS.text,
        },

        style,
      ]}
    >
      {children}
    </Text>
  );
}