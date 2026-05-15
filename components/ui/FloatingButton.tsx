import {
  Pressable,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  RADIUS,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {
  onPress: () => void;
};

export default function FloatingButton({
  onPress,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Pressable
      onPress={onPress}

      style={({ pressed }) => ({

        position: 'absolute',

        right: 20,
        bottom: 100,

        width: 64,
        height: 64,

        borderRadius:
          RADIUS.full,

        backgroundColor:
          pressed
            ? COLORS.primaryLight
            : COLORS.primary,

        justifyContent:
          'center',

        alignItems:
          'center',

        elevation: 8,

        shadowColor:
          '#000',

        shadowOffset: {
          width: 0,
          height: 4,
        },

        shadowOpacity: 0.25,

        shadowRadius: 8,
      })}
    >

      <Ionicons
        name="add"
        size={32}
        color={COLORS.buttonText}
      />

    </Pressable>
  );
}