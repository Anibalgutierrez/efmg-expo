import {
  View,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';

import AppText
from '../../components/ui/AppText';

import useTheme
from '../../hooks/useTheme';
import Screen from '@/components/ui/Screen';
import Header from '@/components/ui/Header';
import { router } from 'expo-router';

type Props = {

  label?: string;

  placeholder?: string;

  value: string;

  onChangeText: (
    text: string
  ) => void;

  secureTextEntry?: boolean;

  multiline?: boolean;

  numberOfLines?: number;

  keyboardType?:
    KeyboardTypeOptions;
};

export default function Input({

  label,

  placeholder,

  value,

  onChangeText,

  secureTextEntry,

  multiline,

  numberOfLines,

  keyboardType,

}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

<Screen>

        <Header
    
              title="Inscripción"
    
              onBack={() => {
    
                if (
                  router.canGoBack()
                ) {
    
                  router.back();
    
                } else {
    
                  router.push(
                    '/matches',
                  );
                }
              }}
            />

    <View
      style={{
        gap: 8,
      }}
    >

      {label && (

        <AppText
          style={{
            fontWeight:
              '700',
          }}
        >
          {label}
        </AppText>

      )}

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

        secureTextEntry={
          secureTextEntry
        }

        multiline={
          multiline
        }

        numberOfLines={
          numberOfLines
        }

        keyboardType={
          keyboardType
        }

        style={{

          backgroundColor:
            COLORS.surface,

          borderWidth: 1,

          borderColor:
            COLORS.border,

          borderRadius: 14,

          paddingHorizontal: 16,

          paddingVertical:
            multiline
              ? 16
              : 14,

          color:
            COLORS.text,

          minHeight:
            multiline
              ? 120
              : undefined,

          textAlignVertical:
            multiline
              ? 'top'
              : 'center',
        }}
      />

    </View>

    </Screen>
  );
}