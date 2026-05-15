import {
  Modal,
  View,
  Pressable,
} from 'react-native';

import AppText
from '../../../components/ui/AppText';

import {
  SPACING,
} from '../../../theme';

import useTheme
from '../../../hooks/useTheme';

type Props = {

  visible: boolean;

  title: string;

  description: string;

  confirmText?: string;

  cancelText?: string;

  onConfirm: () => void;

  onCancel: () => void;
};

export default function ConfirmModal({

  visible,

  title,

  description,

  confirmText = 'Eliminar',

  cancelText = 'Cancelar',

  onConfirm,

  onCancel,

}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >

      <View
        style={{

          flex: 1,

          backgroundColor:
            'rgba(0,0,0,0.55)',

          justifyContent:
            'center',

          alignItems:
            'center',

          padding:
            SPACING.lg,
        }}
      >

        <View
          style={{

            width: '100%',

            maxWidth: 420,

            backgroundColor:
              COLORS.surface,

            borderRadius: 28,

            padding:
              SPACING.xl,

            gap: 20,
          }}
        >

          <View
            style={{
              gap: 10,
            }}
          >

            <AppText
              style={{

                fontSize: 24,

                fontWeight:
                  'bold',

                color:
                  COLORS.text,
              }}
            >
              {title}
            </AppText>

            <AppText
              style={{

                color:
                  COLORS.textSecondary,

                lineHeight: 22,
              }}
            >
              {description}
            </AppText>

          </View>

          <View
            style={{

              flexDirection:
                'row',

              gap: 12,
            }}
          >

            <Pressable
              onPress={
                onCancel
              }

              style={{

                flex: 1,

                height: 52,

                borderRadius: 18,

                backgroundColor:
                  COLORS.background,

                justifyContent:
                  'center',

                alignItems:
                  'center',
              }}
            >

              <AppText
                style={{
                  color:
                    COLORS.text,
                }}
              >
                {cancelText}
              </AppText>

            </Pressable>

            <Pressable
              onPress={
                onConfirm
              }

              style={{

                flex: 1,

                height: 52,

                borderRadius: 18,

                backgroundColor:
                  COLORS.danger,

                justifyContent:
                  'center',

                alignItems:
                  'center',
              }}
            >

              <AppText
                style={{
                  color: 'white',

                  fontWeight:
                    'bold',
                }}
              >
                {confirmText}
              </AppText>

            </Pressable>

          </View>

        </View>

      </View>

    </Modal>
  );
}