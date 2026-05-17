import {
  Text,
  TextInput,
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

  label?: string;

  placeholder?: string;

  value: string;

  onChangeText: (
    text: string,
  ) => void;

  multiline?: boolean;
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
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

      {
        label && (

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
        )
      }

      <TextInput

        value={value}

        onChangeText={
          onChangeText
        }

        placeholder={
          placeholder
        }

        placeholderTextColor={
          COLORS.textSecondary
        }

        multiline={
          multiline
        }

        style={{

          backgroundColor:
            COLORS.surface,

          color:
            COLORS.text,

          borderRadius:
            RADIUS.lg,

          padding:
            SPACING.md,

          borderWidth: 1,

          borderColor:
            COLORS.border,

          minHeight:
            multiline
              ? 120
              : undefined,

          textAlignVertical:
            multiline
              ? 'top'
              : 'center',

          fontSize:
            TYPOGRAPHY.body,
        }}
      />

    </View>
  );
}