import {
  View,
  Pressable,
  Image,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

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

export default function Header({

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
      style={{

        height: 70,

        backgroundColor:
          COLORS.surface,

        flexDirection:
          'row',

        alignItems:
          'center',

        justifyContent:
          'space-between',

        paddingHorizontal: 16,

        borderBottomWidth: 1,

        borderBottomColor:
          COLORS.border,
      }}
    >

      {/* LEFT */}
      <View
        style={{

          width: 40,

          alignItems:
            'flex-start',
        }}
      >

        {onBack ? (

          <Pressable
            onPress={onBack}
          >

            <Ionicons
              name=
                "arrow-back"

              size={24}

              color={
                COLORS.text
              }
            />

          </Pressable>

        ) : (

          leftElement

        )}

      </View>

      {/* CENTER */}
      <View
        style={{
          flex: 1,
          alignItems:
            'center',
        }}
      >

        {title ? (

          <AppText
            style={{

              fontSize: 20,

              fontWeight:
                'bold',
            }}
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

            style={{
              width: 170,
              height: 70,
            }}
          />

        )}

      </View>

      {/* RIGHT */}
      <View
        style={{

          width: 40,

          alignItems:
            'flex-end',
        }}
      >
        {rightElement}
      </View>

    </View>
  );
}