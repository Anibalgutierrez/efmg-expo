import {
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  RADIUS,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export default function IconButton({
  icon,
  onPress,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Pressable
      onPress={onPress}

      style={({ pressed }) => ({

        width: 42,

        height: 42,

        borderRadius:
          RADIUS.full,

        backgroundColor:
          pressed
            ? COLORS.surfaceLight
            : COLORS.surface,

        justifyContent:
          'center',

        alignItems:
          'center',
      })}
    >

      <Ionicons
        name={icon}

        size={22}

        color={
          COLORS.text
        }
      />

    </Pressable>
  );
}