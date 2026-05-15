import {
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';

import {
  RADIUS,
  SPACING,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  const isDisabled =
    disabled || loading;

  return (

    <Pressable
      onPress={onPress}

      disabled={isDisabled}

      style={({ pressed }) => ({

        backgroundColor:
          isDisabled
            ? COLORS.border
            : pressed
              ? COLORS.primaryLight
              : COLORS.primary,

        minHeight: 54,

        paddingHorizontal:
          SPACING.lg,

        borderRadius:
          RADIUS.md,

        justifyContent:
          'center',

        alignItems:
          'center',

        opacity:
          isDisabled
            ? 0.7
            : 1,
      })}
    >

      {loading ? (

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

            fontWeight:
              '700',

            fontSize: 16,

            letterSpacing:
              0.3,
          }}
        >
          {title}
        </Text>

      )}

    </Pressable>
  );
}