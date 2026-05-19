import {
  memo,
} from 'react';

import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

import useTheme
from '../../../hooks/useTheme';

import {
  MatchPlayer,
} from '../types/match.types';

import {
  SPACING,
} from '../../../theme/spacing';

import {
  TYPOGRAPHY,
} from '../../../theme/typography';

import {
  RADIUS,
} from '../../../theme/radius';

type Props = {

  visible: boolean;

  players: MatchPlayer[];

  onClose: () => void;

  onSelectPlayer: (
    player: MatchPlayer,
  ) => void;
};

function GoalPlayerModal({
  visible,
  players,
  onClose,
  onSelectPlayer,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <Modal
      visible={
        visible
      }
      transparent
      animationType="fade"
    >

      <View
        style={{

          flex: 1,

          backgroundColor:
            'rgba(0,0,0,0.6)',

          justifyContent:
            'center',

          padding:
            SPACING.lg,
        }}
      >

        <View
          style={{

            backgroundColor:
              COLORS.surface,

            borderRadius:
              RADIUS.xl,

            padding:
              SPACING.lg,

            maxHeight:
              '80%',
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

              marginBottom:
                SPACING.lg,
            }}
          >
            Seleccionar Goleadora
          </Text>

          {
            players.length === 0 && (

              <Text
                style={{
                  color:
                    COLORS.textSecondary,
                }}
              >
                No hay jugadoras cargadas.
              </Text>
            )
          }

          <FlatList
            data={
              players
            }

            keyExtractor={(
              item,
            ) =>
              item.id
            }

            showsVerticalScrollIndicator={
              false
            }

            contentContainerStyle={{
              gap:
                SPACING.sm,
            }}

            renderItem={({
              item,
            }) => (

              <Pressable

                onPress={() => {

                  onSelectPlayer(
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
                      '700',
                  }}
                >
                  {item.name}
                </Text>

              </Pressable>
            )}
          />

          <Pressable

            onPress={
              onClose
            }

            style={{

              marginTop:
                SPACING.lg,

              alignItems:
                'center',
            }}
          >

            <Text
              style={{

                color:
                  COLORS.primary,

                fontWeight:
                  '800',
              }}
            >
              Cancelar
            </Text>

          </Pressable>

        </View>

      </View>

    </Modal>
  );
}

export default memo(
  GoalPlayerModal,
);