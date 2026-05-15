import {
  useColorScheme,
} from 'react-native';

import {
  darkColors,
} from '../theme/darkColors';

import {
  lightColors,
} from '../theme/lightColors';

export default function useTheme() {

  const scheme =
    useColorScheme();

  const isDark =
    scheme === 'dark';

  const COLORS =
    isDark
      ? darkColors
      : lightColors;

  return {

    COLORS,

    isDark,
  };
}