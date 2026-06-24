import {
  Modal,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import {
  useState,
  useCallback,
  memo,
} from 'react';

import {
  FlashList,
} from '@shopify/flash-list';

import { Ionicons } from '@expo/vector-icons';

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
  deleteComment,
} from '../../../services/posts/comments.service';

import {
  useUserStore,
} from '../../../store/useUserStore';

type Props = {
  visible: boolean;

  onClose: () => void;

  postId: string;

  postOwnerId: string;
};

type CommentItemProps = {
  item: any;
  COLORS: any;
  isOwner: boolean;
  onDelete: (
    commentId: string
  ) => void;
};

const CommentItem = memo(
  ({
    item,
    COLORS,
    isOwner,
    onDelete,
  }: CommentItemProps) => {

    const handleDelete =
      useCallback(() => {

        onDelete(
          item.id
        );

      }, [
        item.id,
        onDelete,
      ]);

    return (

      <View
        style={{

          flexDirection:
            'row',

          alignItems:
            'flex-start',

          marginBottom: 12,
        }}
      >

        <Avatar
          uri={
            item.user?.avatar
          }

          size={42}
        />

        <View
          style={{

            flex: 1,

            marginLeft: 12,

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

          <View
            style={{

              flexDirection:
                'row',

              justifyContent:
                'space-between',

              alignItems:
                'center',

              marginBottom: 4,
            }}
          >

            <AppText
              style={{

                fontWeight:
                  'bold',

                color:
                  COLORS.text,
              }}
            >
              {
                item.user?.name ||
                'Usuario'
              }
            </AppText>

            {isOwner && (

              <Pressable
                onPress={
                  handleDelete
                }

                hitSlop={10}
              >

                <Ionicons
                  name="trash-outline"

                  size={18}

                  color={
                    COLORS.textSecondary
                  }
                />

              </Pressable>

            )}

          </View>

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
    );
  }
);

CommentItem.displayName =
  'CommentItem';

function CommentsModal({

  visible,

  onClose,

  postId,

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

  // =========================
  // CREATE COMMENT
  // =========================
  const handleComment =
    useCallback(async () => {

      const trimmed =
        text.trim();

      if (
        !trimmed ||
        !user
      ) {
        return;
      }

      try {

        setLoading(true);

        await createComment(
          postId,
          {
            text: trimmed,

            createdAt:
              new Date() as any,

            user: {

              id:
                user.id,

              name:
                user.name,

              avatar:
                user.avatar || '',

              bio:
                user.bio || '',

              followersCount:
                user.followersCount || 0,

              followingCount:
                user.followingCount || 0,

              postsCount:
                user.postsCount || 0,

              role:
                user.role,
            },
          }
        );

        setText('');

      } catch (error) {

        console.log(
          error
        );

      } finally {

        setLoading(false);
      }

    }, [
      text,
      user,
      postId,
    ]);

  // =========================
  // DELETE COMMENT
  // =========================
  const handleDeleteComment =
    useCallback(async (
      commentId: string
    ) => {

      try {

        await deleteComment(
          postId,
          commentId
        );

      } catch (error) {

        console.log(
          error
        );
      }

    }, [
      postId,
    ]);

  // =========================
  // RENDER ITEM
  // =========================
  const renderItem =
    useCallback(({
      item,
    }: any) => (

      <CommentItem
        item={item}

        COLORS={COLORS}

        isOwner={
          item.user?.id ===
          user?.id
        }

        onDelete={
          handleDeleteComment
        }
      />

    ), [
      COLORS,
      user?.id,
      handleDeleteComment,
    ]);

  const keyExtractor =
    useCallback(
      (item: any) =>
        item.id,
      []
    );

  return (

    <Modal
      visible={visible}

      animationType="slide"

      presentationStyle="fullScreen"

      statusBarTranslucent

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
        <FlashList
          data={comments || []}

          renderItem={
            renderItem
          }

          keyExtractor={
            keyExtractor
          }

          removeClippedSubviews

          keyboardShouldPersistTaps="handled"

          contentContainerStyle={{
            padding:
              SPACING.lg,

            paddingBottom: 140,
          }}

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

export default memo(
  CommentsModal
);