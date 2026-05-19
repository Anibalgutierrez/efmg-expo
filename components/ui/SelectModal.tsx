import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import useTheme
from '../../hooks/useTheme';

import {
  RADIUS,
} from '../../theme/radius';

import {
  SPACING,
} from '../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../theme/typography';

type Item = {
  id: string;
  name: string;
};

type Props = {

  visible: boolean;

  title: string;

  items: Item[];

  onClose: () => void;

  onSelect: (
    item: Item,
  ) => void;
};

export default function SelectModal({
  visible,
  title,
  items,
  onClose,
  onSelect,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >

      <View
        style={{

          flex: 1,

          backgroundColor:
            COLORS.overlay,

          justifyContent:
            'flex-end',
        }}
      >

        <View
          style={{

            backgroundColor:
              COLORS.surface,

            borderTopLeftRadius:
              RADIUS.xl,

            borderTopRightRadius:
              RADIUS.xl,

            height: '75%',

            padding:
              SPACING.md,
          }}
        >

          {/* HEADER */}

          <View
            style={{

              flexDirection:
                'row',

              justifyContent:
                'space-between',

              alignItems:
                'center',

              marginBottom:
                SPACING.md,
            }}
          >

            <Text
              style={{

                color:
                  COLORS.text,

                fontSize:
                  TYPOGRAPHY.subtitle,

                fontWeight:
                  '800',
              }}
            >
              {title}
            </Text>

            <Pressable
              onPress={
                onClose
              }
            >

              <Text
                style={{

                  color:
                    COLORS.primary,

                  fontWeight:
                    '700',
                }}
              >
                Cerrar
              </Text>

            </Pressable>

          </View>

          {/* ITEMS */}

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >

            <View
              style={{
                gap:
                  SPACING.sm,
              }}
            >

              {
                items.map(
                  (
                    item,
                  ) => (

                    <Pressable

                      key={
                        item.id
                      }

                      onPress={() => {

                        onSelect(
                          item,
                        );

                        onClose();
                      }}

                      style={{

                        backgroundColor:
                          COLORS.surfaceLight,

                        borderRadius:
                          RADIUS.lg,

                        padding:
                          SPACING.md,
                      }}
                    >

                      <Text
                        style={{

                          color:
                            COLORS.text,

                          fontSize:
                            TYPOGRAPHY.body,

                          fontWeight:
                            '600',
                        }}
                      >
                        {item.name}
                      </Text>

                    </Pressable>
                  ),
                )
              }

            </View>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
}