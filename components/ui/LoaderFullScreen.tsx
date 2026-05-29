import {
  View,
} from 'react-native';

import {
  useEffect,
} from 'react';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import AppText
from './AppText';

export default function LoaderFullScreen() {

  const translateX =
    useSharedValue(-220);

  useEffect(() => {

    translateX.value =
      withRepeat(

        withTiming(
          220,
          {
            duration: 1400,
            easing:
              Easing.linear,
          }
        ),

        -1,
        false
      );

  }, []);

  const barStyle =
    useAnimatedStyle(() => {

      return {

        transform: [
          {
            translateX:
              translateX.value,
          },
        ],
      };

    });

  return (

    <View
      style={{

        flex: 1,

        backgroundColor:
          '#0B0F1A',

        justifyContent:
          'center',

        alignItems:
          'center',
      }}
    >

      <AppText
        style={{

          color: '#FFFFFF',

          fontSize: 26,

          fontWeight: 'bold',

          letterSpacing: 1,
        }}
      >
        EFMG V/B
      </AppText>

      <AppText
        style={{

          color:
            'rgba(255,255,255,0.7)',

          marginTop: 8,

          fontSize: 15,
        }}
      >
        Cargando comunidad...
      </AppText>

      <View
  style={{

    width: 220,

    height: 4,

    marginTop: 40,

    backgroundColor:
      '#1E3A5F',

    borderRadius: 999,

    overflow: 'hidden',
  }}
>

  <Animated.View
    style={[
      {

        width: 80,

        height: '100%',

        backgroundColor:
          '#FFFFFF',

        borderRadius: 999,
      },

      barStyle,
    ]}
  />

</View>

    </View>
  );
}