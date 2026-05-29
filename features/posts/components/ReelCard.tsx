import {
  View,
  Pressable,
  Keyboard,
  useWindowDimensions,
} from 'react-native';

import {
  memo,
  useState,
  useCallback,
  useMemo,
} from 'react';

import {
  useRouter,
} from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  Image,
} from 'expo-image';

import Card
  from '../../../components/ui/Card';

import AppText
  from '../../../components/ui/AppText';

import Divider
  from '../../../components/ui/Divider';

import ConfirmModal
  from './ConfirmModal';

import CommentsModal
  from '../../comments/components/CommentsModal';

import useTheme
  from '../../../hooks/useTheme';

import useLikePost
  from '../hooks/useLikePost';

import {
  useUserStore,
} from '../../../store/useUserStore';

import {
  usePostsStore,
} from '../store/usePostsStore';

import {
  deletePost,
} from '../../../services/posts/delete-post.service';

import {
  SPACING,
} from '../../../theme';

import {
  Post,
} from '../types/post.types';

import PostHeader
  from './shared/PostHeader';

import PostActions
  from './shared/PostActions';

import {
  formatPostDate,
} from '../utils/formatPostDate';

import {
  getImageUri,
} from '../../../utils/getImageUri';

type Props = {
  post: Post;
};

function ReelCard({
  post,
}: Props) {

  const router =
    useRouter();

  const {
    width,
  } = useWindowDimensions();

  const {
    COLORS,
  } = useTheme();

  const user =
    useUserStore(
      (state) => state.user
    );

  const removePost =
    usePostsStore(
      (state) =>
        state.removePost
    );

  const isOwner =
    user?.id ===
    post.user.id;

  const [
    commentsVisible,
    setCommentsVisible,
  ] = useState(false);

  const [
    deleteVisible,
    setDeleteVisible,
  ] = useState(false);

  const {
    liked,
    likes,
    toggleLike,
  } = useLikePost(

    post.id,

    post.likesCount,

    user?.id,

    post.user.id
  );

  // =========================
  // DATE
  // =========================
  const createdAtText =
    useMemo(() => {

      return formatPostDate(
        post.createdAt
      );

    }, [
      post.createdAt,
    ]);

  // =========================
  // THUMB
  // =========================
  const thumbnail =
    useMemo(() => {

      return getImageUri(
        post.thumbnail
      );

    }, [
      post.thumbnail,
    ]);

  // =========================
  // HEIGHT
  // =========================
  const mediaHeight =
    useMemo(() => {

      return width > 500
        ? 520
        : 420;

    }, [width]);

  // =========================
  // ACTIONS
  // =========================
  const openComments =
    useCallback(() => {

      setCommentsVisible(
        true
      );

    }, []);

  const closeComments =
    useCallback(() => {

      setCommentsVisible(
        false
      );

    }, []);

  const openDeleteModal =
    useCallback(() => {

      setDeleteVisible(
        true
      );

    }, []);

  const closeDeleteModal =
    useCallback(() => {

      setDeleteVisible(
        false
      );

    }, []);

  const openProfile =
    useCallback(() => {

      Keyboard.dismiss();

      router.push(
        `/profile/${post.user.id}`
      );

    }, [
      post.user.id,
      router,
    ]);

  const openReel =
    useCallback(() => {

      router.push({

        pathname:
          '/reels',

        params: {

          reelId:
            post.id,
        },
      });

    }, [
      post.id,
      router,
    ]);

  // =========================
  // DELETE
  // =========================
  const handleDeletePost =
    useCallback(async () => {

      try {

        await deletePost(
          post.id
        );

        removePost(
          post.id
        );

        setDeleteVisible(
          false
        );

      } catch (error) {

        console.error(
          error
        );
      }

    }, [
      post.id,
      removePost,
    ]);

  return (

    <>

      <Card>

        {/* HEADER */}
        <PostHeader
          post={post}
          createdAtText={createdAtText}
          isOwner={isOwner}
          onPressProfile={openProfile}
          onPressDelete={openDeleteModal}
        />

        {/* CONTENT */}
        {!!post.content && (

          <AppText
            style={{

              marginBottom:
                SPACING.md,

              lineHeight: 22,

              color:
                COLORS.text,
            }}
          >
            {post.content}
          </AppText>

        )}

        {/* REEL */}
        {!!thumbnail && (

          <Pressable
            onPress={
              openReel
            }
          >

            <View>

              <Image
                source={{
                  uri:
                    thumbnail,
                }}

                recyclingKey={
                  post.id
                }

                cachePolicy="memory-disk"

                allowDownscaling

                contentFit="cover"

                transition={120}

                style={{

                  width: '100%',

                  height:
                    mediaHeight,

                  borderRadius: 18,

                  marginBottom:
                    SPACING.md,
                }}

                placeholder={require('../../../assets/placeholder.png')}
              />

              <View
                style={{

                  pointerEvents:
                    'none',

                  position:
                    'absolute',

                  top: '50%',

                  left: '50%',

                  transform: [

                    {
                      translateX:
                        -40,
                    },

                    {
                      translateY:
                        -40,
                    },
                  ],

                  backgroundColor:
                    'rgba(0,0,0,0.5)',

                  width: 80,

                  height: 80,

                  borderRadius: 40,

                  justifyContent:
                    'center',

                  alignItems:
                    'center',
                }}
              >

                <Ionicons
                  name="play"
                  size={44}
                  color="white"
                />

              </View>

            </View>

          </Pressable>

        )}

        <Divider />

        {/* ACTIONS */}
        <PostActions
          liked={liked}
          likes={likes}
          commentsCount={post.commentsCount}
          onLike={toggleLike}
          onComments={openComments}
        />

      </Card>

      {/* COMMENTS */}
      {commentsVisible && (

        <CommentsModal
          visible={
            commentsVisible
          }

          onClose={
            closeComments
          }

          postId={
            post.id
          }

          postOwnerId={
            post.user.id
          }
        />

      )}

      {/* DELETE */}
      <ConfirmModal
        visible={
          deleteVisible
        }

        title=
          "Eliminar reel"

        description=
          "Esta acción no se puede deshacer."

        onCancel={
          closeDeleteModal
        }

        onConfirm={
          handleDeletePost
        }
      />

    </>

  );
}

export default memo(
  ReelCard,
  (prev, next) => (

    prev.post.id ===
      next.post.id &&

    prev.post.likesCount ===
      next.post.likesCount &&

    prev.post.commentsCount ===
      next.post.commentsCount &&

    prev.post.content ===
      next.post.content &&

    prev.post.thumbnail ===
      next.post.thumbnail &&

    prev.post.user.id ===
      next.post.user.id &&

    prev.post.user.name ===
      next.post.user.name
  )
);