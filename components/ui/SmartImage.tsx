import {
  memo,
} from 'react';

import {
  View,
  ActivityIndicator,
  StyleProp,
  ImageStyle,
  ViewStyle,
} from 'react-native';

import {
  Image,
} from 'expo-image';

import useTheme
  from '../../hooks/useTheme';

type Props = {
  uri?: string | null;

  style?: StyleProp<ImageStyle>;

  containerStyle?: StyleProp<ViewStyle>;

  contentFit?:
    | 'cover'
    | 'contain'
    | 'fill';

  priority?:
    | 'low'
    | 'normal'
    | 'high';

  transition?: number;

  borderRadius?: number;

  recyclingKey?: string;

  placeholder?: any;
};

function SmartImage({

  uri,

  style,

  containerStyle,

  contentFit = 'cover',

  priority = 'normal',

  transition = 180,

  borderRadius = 0,

  recyclingKey,

  placeholder,

}: Props) {

  const {
    COLORS,
  } = useTheme();

  // =========================
  // EMPTY IMAGE
  // =========================
  if (!uri) {

    return (

      <View
        style={[
          {
            backgroundColor:
              COLORS.surfaceLight,

            justifyContent:
              'center',

            alignItems:
              'center',

            overflow:
              'hidden',

            borderRadius,
          },

          style,
          containerStyle,
        ]}
      >

        <ActivityIndicator
          color={
            COLORS.textSecondary
          }
        />

      </View>

    );
  }

  return (

    <Image
      source={{
        uri,
      }}

      style={[
        {
          borderRadius,
          backgroundColor:
            COLORS.surfaceLight,
        },

        style,
      ]}

      placeholder={
        placeholder
      }

      contentFit={
        contentFit
      }

      transition={
        transition
      }

      priority={
        priority
      }

      recyclingKey={
        recyclingKey ||
        uri
      }

      cachePolicy=
        "memory-disk"

      allowDownscaling

      responsivePolicy=
        "static"
    />

  );
}

export default memo(
  SmartImage
);