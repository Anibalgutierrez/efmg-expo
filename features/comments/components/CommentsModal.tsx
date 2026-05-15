import {
  Modal,
  View,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  Ionicons,
} from '@expo/vector-icons';

import AppButton
from '../../../components/ui/AppButton';

import AppText
from '../../../components/ui/AppText';

import Avatar
from '../../../components/ui/Avatar';

import {
  SPACING,
  RADIUS,
} from '../../../theme';

import useTheme
from '../../../hooks/useTheme';

import useComments
from '../hooks/useComments';

import {
  createComment,
} from '../../../services/comments/comments.service';

import {
  useUserStore,
} from '../../../store/useUserStore';

type Props = {
  visible: boolean;

  onClose: () => void;

  postId: string;

  postOwnerId: string;
};

export default function CommentsModal({

  visible,

  onClose,

  postId,

  postOwnerId,

}: Props) {

  const {
    COLORS,
  } = useTheme();

  const {
    comments,
  } = useComments(
    postId
  );

  const user =
    useUserStore(
      (state) => state.user
    );

  const [
    text,
    setText,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleComment() {

    if (
      !text.trim()
    ) return;

    if (!user) return;

    try {

      setLoading(true);

      await createComment(
        postId,
        postOwnerId,
        user,
        text
      );

      setText('');

    } finally {

      setLoading(false);
    }
  }

  return (

    <Modal
      visible={visible}

      animationType="slide"

      presentationStyle="fullScreen"

      onRequestClose={
        onClose
      }
    >

      <KeyboardAvoidingView
        behavior={
          Platform.OS ===
          'ios'
            ? 'padding'
            : undefined
        }

        style={{
          flex: 1,

          backgroundColor:
            COLORS.background,
        }}
      >

        {/* HEADER */}
        <View
          style={{

            height: 64,

            paddingHorizontal:
              SPACING.lg,

            flexDirection:
              'row',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            borderBottomWidth: 1,

            borderBottomColor:
              COLORS.border,

            backgroundColor:
              COLORS.surface,
          }}
        >

          <AppText
            style={{

              fontSize: 22,

              fontWeight:
                'bold',

              color:
                COLORS.text,
            }}
          >
            Comentarios
          </AppText>

          <Pressable
            onPress={
              onClose
            }

            style={{

              width: 40,

              height: 40,

              borderRadius: 999,

              justifyContent:
                'center',

              alignItems:
                'center',

              backgroundColor:
                COLORS.surfaceLight,
            }}
          >

            <Ionicons
              name="close"

              size={22}

              color={
                COLORS.text
              }
            />

          </Pressable>

        </View>

        {/* COMMENTS */}
        <FlatList
          data={comments}

          keyExtractor={(item) =>
            item.id
          }

          contentContainerStyle={{

            padding:
              SPACING.lg,

            gap: SPACING.md,

            paddingBottom: 140,
          }}

          renderItem={({
            item,
          }) => (

            <View
              style={{

                flexDirection:
                  'row',

                gap: 12,
              }}
            >

              <Avatar
                uri={
                  item.user.avatar
                }

                size={42}
              />

              <View
                style={{

                  flex: 1,

                  backgroundColor:
                    COLORS.surface,

                  borderRadius:
                    RADIUS.lg,

                  padding:
                    SPACING.md,

                  borderWidth: 1,

                  borderColor:
                    COLORS.border,
                }}
              >

                <AppText
                  style={{

                    fontWeight:
                      'bold',

                    color:
                      COLORS.text,

                    marginBottom: 4,
                  }}
                >
                  {item.user.name}
                </AppText>

                <AppText
                  style={{
                    color:
                      COLORS.text,

                    lineHeight: 22,
                  }}
                >
                  {item.text}
                </AppText>

              </View>

            </View>
          )}

          ListEmptyComponent={

            <View
              style={{
                paddingTop: 80,

                alignItems:
                  'center',
              }}
            >

              <AppText
                style={{
                  color:
                    COLORS.textSecondary,
                }}
              >
                No hay comentarios todavía
              </AppText>

            </View>
          }
        />

        {/* INPUT */}
        <View
          style={{

            padding:
              SPACING.lg,

            borderTopWidth: 1,

            borderTopColor:
              COLORS.border,

            backgroundColor:
              COLORS.surface,

            gap: SPACING.md,
          }}
        >

          <TextInput
            placeholder=
              "Escribe un comentario..."

            placeholderTextColor={
              COLORS.textSecondary
            }

            value={text}

            onChangeText={
              setText
            }

            multiline

            style={{

              minHeight: 54,

              maxHeight: 120,

              backgroundColor:
                COLORS.background,

              borderRadius:
                RADIUS.lg,

              padding:
                SPACING.md,

              color:
                COLORS.text,

              textAlignVertical:
                'top',

              borderWidth: 1,

              borderColor:
                COLORS.border,
            }}
          />

          <AppButton
            title=
              "Comentar"

            loading={
              loading
            }

            disabled={
              !text.trim()
            }

            onPress={
              handleComment
            }
          />

        </View>

      </KeyboardAvoidingView>

    </Modal>
  );
}