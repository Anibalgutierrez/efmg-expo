import {
  useState,
  useRef,
} from 'react';

import {
  FlatList,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import {
  serverTimestamp,
} from 'firebase/firestore';

import {
  useUserStore,
} from '../../store/useUserStore';

import useCanPost
from '../../hooks/useCanPost';

import Screen
from '../../components/ui/Screen';

import Header
from '../../components/ui/Header';

import IconButton
from '../../components/ui/IconButton';

import AppText
from '../../components/ui/AppText';

import EmptyState
from '../../components/ui/EmptyState';

import Loader
from '../../components/ui/Loader';

import PostCard
from '../../features/posts/components/PostCard';

import usePosts
from '../../features/posts/hooks/usePosts';

import {
  createPost,
} from '../../services/posts/posts.service';

import useImagePicker
from '../../hooks/useImagePicker';

import {
  uploadImage,
} from '../../services/storage/storage.service';

import HeroCarousel
from '../../features/hero/components/HeroCarousel';

import useUnreadNotifications
from '../../features/notifications/hooks/useUnreadNotifications';

import {
  PostType,
  ReelPlatform,
} from '../../types/post.types';

import 
  useTabBar
 from '../../context/TabBarContext';

export default function HomeScreen() {

  const router =
    useRouter();

  const user =
    useUserStore(
      (state) => state.user
    );

  const unreadCount =
    useUnreadNotifications(
      user?.id
    );

  const canPost =
    useCanPost();

  const {
    showTabBar,
    hideTabBar,
  } = useTabBar();

  const lastScrollY =
    useRef(0);

  const [
    modalVisible,
    setModalVisible,
  ] = useState(false);

  const {
    posts,
    loading,
  } = usePosts();

  const {
    pickImage,
  } = useImagePicker();

  async function handleCreatePost(
    data: {
      type: PostType;
      content: string;
      imageUri?: string;
      reelUrl?: string;
      thumbnail?: string;
      platform?: ReelPlatform;
    }
  ) {

    if (!user) return;

    let imageUrl = '';

    if (
      data.imageUri
    ) {

      imageUrl =
        await uploadImage(
          data.imageUri
        );
    }

    await createPost({

      type:
        data.type,

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

      content:
        data.content,

      image:
        imageUrl || '',

      likesCount: 0,

      commentsCount: 0,

      createdAt:
        serverTimestamp() as any,

      ...(data.reelUrl && {
        reelUrl:
          data.reelUrl,
      }),

      ...(data.platform && {
        platform:
          data.platform,
      }),

      ...(data.thumbnail && {
        thumbnail:
          data.thumbnail,
      }),
    });

    setModalVisible(
      false
    );
  }

  return (

    <Screen>

      <Header
        rightElement={

          <View>

            <IconButton
              icon=
                "notifications-outline"

              onPress={() =>
                router.push(
                  '/notifications'
                )
              }
            />

            {unreadCount > 0 && (

              <View
                style={{

                  position:
                    'absolute',

                  top: -2,
                  right: -2,

                  minWidth: 18,
                  height: 18,

                  borderRadius: 999,

                  backgroundColor:
                    'red',

                  justifyContent:
                    'center',

                  alignItems:
                    'center',

                  paddingHorizontal: 4,
                }}
              >

                <AppText
                  style={{

                    color: 'white',

                    fontSize: 10,

                    fontWeight:
                      'bold',
                  }}
                >
                  {unreadCount}
                </AppText>

              </View>

            )}

          </View>
        }
      />

      <FlatList
        data={posts}

        keyExtractor={(item) =>
          item.id
        }

        onScroll={(event) => {

  const currentY =
    event.nativeEvent
      .contentOffset.y;

  const diff =
    currentY -
    lastScrollY.current;

  // BAJA
  if (
    diff > 6 &&
    currentY > 40
  ) {

    hideTabBar();
  }

  // SUBE
  if (
    diff < -6
  ) {

    showTabBar();
  }

  lastScrollY.current =
    currentY;
}}
        scrollEventThrottle={16}

        renderItem={({ item }) => (
          <PostCard
            post={item}
          />
        )}

        showsVerticalScrollIndicator={
          false
        }

        ListHeaderComponent={
          <>

            <HeroCarousel />

            {user && (

              <AppText
                style={{
                  marginVertical:
                    16,

                  fontWeight:
                    'bold',
                }}
              >
                Bienvenido{' '}
                {user.name}
              </AppText>

            )}

          </>
        }

        contentContainerStyle={{
          paddingBottom:
            140,

          paddingHorizontal:
            16,
        }}

        ListEmptyComponent={
          loading
            ? (
              <Loader />
            )
            : (
              <EmptyState
                title=
                  "No hay posts todavía."
              />
            )
        }
      />


    </Screen>
  );
}