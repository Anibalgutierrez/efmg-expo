import {
  View,
  Pressable,
  Keyboard,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useRouter,
} from 'expo-router';

import {
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Image,
} from 'expo-image';

import Card
from '../../../components/ui/Card';

import AppText
from '../../../components/ui/AppText';

import Avatar
from '../../../components/ui/Avatar';

import IconButton
from '../../../components/ui/IconButton';

import Divider
from '../../../components/ui/Divider';

import useLikePost
from '../hooks/useLikePost';

import CommentsModal
from '../../comments/components/CommentsModal';

import {
  useUserStore,
} from '../../../store/useUserStore';

import {
  usePostsStore,
} from '../../../store/usePostsStore';

import useTheme
from '../../../hooks/useTheme';

import {
  SPACING,
} from '../../../theme';

import {
  Post,
} from '../../../types/post.types';

import {
  deletePost,
} from '../../../services/posts/delete-post.service';

import ConfirmModal
from './ConfirmModal';

import PostMediaCarousel
from './PostMediaCarousel';

type Props = {
  post: Post;
};

function PostCard({
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

      if (!post.createdAt) {
        return '';
      }

      try {

        if (
          typeof (post.createdAt as any)
            ?.toDate === 'function'
        ) {

          return (
            post.createdAt as any
          )
            .toDate()
            .toLocaleString();
        }

        if (
          post.createdAt instanceof Date
        ) {

          return post.createdAt
            .toLocaleString();
        }

        const parsedDate =
          new Date(
            post.createdAt as any
          );

        if (
          isNaN(
            parsedDate.getTime()
          )
        ) {

          return '';
        }

        return parsedDate
          .toLocaleString();

      } catch {

        return '';
      }

    }, [
      post.createdAt,
    ]);

  // =========================
  // IMAGES
  // =========================
  const postImages =
  useMemo(() => {

    if (
      post.images &&
      post.images.length > 0
    ) {

      return post.images;
    }

    if (
      post.image
    ) {

      if (
        typeof post.image ===
        'string'
      ) {

        return [
          {
            original:
              post.image,

            medium:
              post.image,

            thumb:
              post.image,
          },
        ];
      }

      return [
        {
          original:
            post.image.original,

          medium:
            post.image.medium,

          thumb:
            post.image.thumb,
        },
      ];
    }

    return [];

  }, [
    post.images,
    post.image,
  ]);

  // =========================
  // HEIGHT
  // =========================
  const mediaHeight =
    useMemo(() => {

      return width > 500
        ? (
          post.type ===
            'reel'

            ? 520
            : 360
        )
        : (
          post.type ===
            'reel'

            ? 420
            : 240
        );

    }, [
      width,
      post.type,
    ]);

  // =========================
  // ACTIONS
  // =========================
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
        <View
          style={{

            flexDirection:
              'row',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            marginBottom:
              SPACING.md,
          }}
        >

          <Pressable
            onPress={
              openProfile
            }

            style={{

              flexDirection:
                'row',

              alignItems:
                'center',

              flex: 1,
            }}
          >

            <Avatar
              uri={
                user?.avatar
              }
            />

            <View
              style={{

                marginLeft: 12,

                flex: 1,
              }}
            >

              <AppText
                numberOfLines={1}

                style={{

                  fontWeight:
                    'bold',

                  color:
                    COLORS.text,
                }}
              >
                {post.user.name}
              </AppText>

              <AppText
                style={{

                  color:
                    COLORS.textSecondary,

                  fontSize: 13,
                }}
              >
                {createdAtText}
              </AppText>

            </View>

          </Pressable>

          {isOwner ? (

            <IconButton
              icon="trash-outline"

              onPress={
                openDeleteModal
              }
            />

          ) : (

            <IconButton
              icon="ellipsis-horizontal"
            />

          )}

        </View>

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
        {post.type ===
          'reel' && (

            <Pressable
              onPress={
                openReel
              }
            >

              <View>

                <Image
                  source={{
                    uri:
                      post.thumbnail,
                  }}

                  recyclingKey={
                    post.id
                  }

                  cachePolicy="memory-disk"

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

        {/* IMAGES */}
        {post.type ===
          'post' &&
          postImages.length > 0 && (

            <PostMediaCarousel
              postId={post.id}
              images={postImages}
              height={mediaHeight}
            />

        )}

        <Divider />

        {/* ACTIONS */}
        <View
          style={{

            flexDirection:
              'row',

            justifyContent:
              'space-around',

            marginTop:
              SPACING.md,
          }}
        >

          <Pressable
            onPress={
              toggleLike
            }

            style={{
              padding: 8,
            }}
          >

            <AppText
              style={{
                color:
                  COLORS.text,
              }}
            >

              {liked
                ? '❤️'
                : '🤍'}{' '}

              {likes}

            </AppText>

          </Pressable>

          <Pressable
            onPress={
              openComments
            }

            style={{
              padding: 8,
            }}
          >

            <AppText
              style={{
                color:
                  COLORS.text,
              }}
            >
              💬 {post.commentsCount}
            </AppText>

          </Pressable>

        </View>

      </Card>

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

      <ConfirmModal
        visible={
          deleteVisible
        }

        title=
        "Eliminar publicación"

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
  PostCard,
  (prev, next) => {

    return (

      prev.post.id ===
      next.post.id &&

      prev.post.likesCount ===
      next.post.likesCount &&

      prev.post.commentsCount ===
      next.post.commentsCount &&

      prev.post.content ===
      next.post.content &&

      JSON.stringify(
        prev.post.images
      ) ===
      JSON.stringify(
        next.post.images
      ) &&

      prev.post.thumbnail ===
      next.post.thumbnail
    );
  }
);