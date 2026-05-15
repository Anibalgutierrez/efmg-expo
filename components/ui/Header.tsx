import {
  View,
  Pressable,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import AppText
from './AppText';

import useTheme
from '../../hooks/useTheme';

type Props = {

  title: string;

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
  } = useTheme();

  return (

    <View
      style={{

        height: 60,

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

      {/* TITLE */}
      <AppText
        style={{

          fontSize: 20,

          fontWeight:
            'bold',
        }}
      >
        {title}
      </AppText>

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