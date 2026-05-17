import {
  Pressable,
  Text,
  View,
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

  label: string;

  value?: string;

  placeholder?: string;

  onPress: () => void;
};

export default function SelectorCard({
  label,
  value,
  placeholder = 'Seleccionar',
  onPress,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{
        gap: SPACING.sm,
      }}
    >

      <Text
        style={{

          color:
            COLORS.text,

          fontSize:
            TYPOGRAPHY.caption,

          fontWeight:
            '700',
        }}
      >
        {label}
      </Text>

      <Pressable

        onPress={onPress}

        style={{

          backgroundColor:
            COLORS.surface,

          borderRadius:
            RADIUS.lg,

          padding:
            SPACING.md,

          borderWidth: 1,

          borderColor:
            COLORS.border,

          minHeight: 56,

          justifyContent:
            'center',
        }}
      >

        <Text
          style={{

            color:
              value
                ? COLORS.text
                : COLORS.textSecondary,

            fontSize:
              TYPOGRAPHY.body,

            fontWeight:
              value
                ? '600'
                : '400',
          }}
        >
          {value || placeholder}
        </Text>

      </Pressable>

    </View>
  );
}