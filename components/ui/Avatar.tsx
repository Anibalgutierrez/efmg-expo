import {
  View,
  StyleProp,
  ImageStyle,
} from 'react-native';

import {
  Image,
} from 'expo-image';

import {
  memo,
} from 'react';

import {
  RADIUS,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

type Props = {

  uri?: string;

  size?: number;

  width?: number;

  height?: number;

  style?: StyleProp<ImageStyle>;
};

function Avatar({

  uri,

  size = 48,

  width,

  height,

  style,

}: Props) {

  const {
    COLORS,
  } = useTheme();

  const finalWidth =
    width || size;

  const finalHeight =
    height || size;

  const borderRadius =
    Math.min(
      finalWidth,
      finalHeight
    ) / 2;

  // =========================
  // EMPTY AVATAR
  // =========================
  if (!uri) {

    return (

      <View
        style={[

          {

            width:
              finalWidth,

            height:
              finalHeight,

            borderRadius,

            backgroundColor:
              COLORS.surfaceLight,
          },

          style,
        ]}
      />

    );
  }

  // =========================
  // IMAGE AVATAR
  // =========================
  return (

    <Image
      source={{
        uri,
      }}

      cachePolicy=
        "memory-disk"

      transition={80}

      contentFit=
        "cover"

      style={[

        {

          width:
            finalWidth,

          height:
            finalHeight,

          borderRadius,
        },

        style,
      ]}

      
    />

  );
}

export default memo(
  Avatar,
  (prev, next) =>
    prev.uri === next.uri &&
    prev.size === next.size &&
    prev.width === next.width &&
    prev.height === next.height
);