import React, {
  memo,
} from 'react';

import {
  View,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AppText
from './AppText';

import useTheme
from '../../hooks/useTheme';

type Props = {

  title?: string;

  leftElement?: React.ReactNode;

  rightElement?: React.ReactNode;

  onBack?: () => void;
};

function Header({

  title,

  leftElement,

  rightElement,

  onBack,

}: Props) {

  const {
    COLORS,
    isDark,
  } = useTheme();

  return (

    <View
      style={[

        styles.container,

        {

          backgroundColor:
            COLORS.surface,

          borderBottomColor:
            COLORS.border,
        },
      ]}
    >

      {/* LEFT */}
      <View
        style={styles.side}
      >

        {onBack ? (

          <Pressable

            onPress={onBack}

            hitSlop={10}
          >

            <Ionicons
              name="arrow-back"
              size={24}
              color={COLORS.text}
            />

          </Pressable>

        ) : (

          leftElement

        )}

      </View>

      {/* CENTER */}
      <View
        style={styles.center}
      >

        {title ? (

          <AppText
            style={styles.title}
          >
            {title}
          </AppText>

        ) : (

          <Image

            source={
              isDark
                ? require('../../assets/logos/logo-light.png')
                : require('../../assets/logos/logo-dark.png')
            }

            resizeMode="contain"

            style={styles.logo}
          />

        )}

      </View>

      {/* RIGHT */}
      <View
        style={[
          styles.side,
          styles.right,
        ]}
      >

        {rightElement}

      </View>

    </View>
  );
}

export default memo(Header);

const styles =
  StyleSheet.create({

    container: {

      height: 70,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      paddingHorizontal: 16,

      borderBottomWidth: 1,
    },

    side: {

      width: 40,

      justifyContent:
        'center',
    },

    right: {

      alignItems:
        'flex-end',
    },

    center: {

      flex: 1,

      alignItems:
        'center',
    },

    title: {

      fontSize: 20,

      fontWeight:
        'bold',
    },

    logo: {

      width: 170,

      height: 60,
    },
  });