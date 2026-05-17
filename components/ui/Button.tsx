import {
  ActivityIndicator,
  Pressable,
  Text,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

import {
  RADIUS,
} from '../../theme/radius';

import {
  SPACING,
} from '../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../theme/typography';

type Props = {

  title: string;

  onPress: () => void;

  loading?: boolean;

  disabled?: boolean;

  variant?:
    | 'primary'
    | 'success'
    | 'danger';
};

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: Props) {

  const {
    COLORS,
  } = useTheme();

  const backgroundColor =

    variant === 'success'
      ? COLORS.success

      : variant === 'danger'
      ? COLORS.danger

      : COLORS.primary;

  return (

    <Pressable

      disabled={
        disabled ||
        loading
      }

      onPress={onPress}

      style={{

        backgroundColor,

        opacity:
          disabled ||
          loading
            ? 0.6
            : 1,

        borderRadius:
          RADIUS.lg,

        padding:
          SPACING.lg,

        alignItems:
          'center',
      }}
    >

      {
        loading ? (

          <ActivityIndicator
            color={
              COLORS.buttonText
            }
          />

        ) : (

          <Text
            style={{

              color:
                COLORS.buttonText,

              fontSize:
                TYPOGRAPHY.body,

              fontWeight:
                '800',
            }}
          >
            {title}
          </Text>
        )
      }

    </Pressable>
  );
}