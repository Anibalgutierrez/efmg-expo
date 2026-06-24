import {
  useCallback,
  useMemo,
  useRef,
} from 'react';

import {
  View,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import {
  FlashList,
  ListRenderItem,
} from '@shopify/flash-list';

import {
  useRouter,
} from 'expo-router';

import {
  useUserStore,
} from '../../store/useUserStore';

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

import HeroCarousel
  from '../../features/hero/components/HeroCarousel';

import useUnreadNotifications
  from '../../features/notifications/hooks/useUnreadNotifications';

import useTabBar
  from '../../context/TabBarContext';

import FeedItem
  from '../../features/posts/components/FeedItem';

import usePosts
  from '../../features/posts/hooks/usePosts';

import {
  Post,
} from '../../features/posts/types/post.types';
import FeedSkeleton from '@/features/posts/components/FeedSkeleton';

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

  const {
    showTabBar,
    hideTabBar,
  } = useTabBar();

  const lastScrollY =
    useRef(0);

  const {

    posts,

    loading,

    loadingMore,

    refreshing,

    loadMorePosts,

    refreshPosts,

  } = usePosts();

  // =========================
  // RENDER ITEM
  // =========================
  const renderItem:
    ListRenderItem<Post> =

    useCallback(

      ({ item }) => (

        <FeedItem
          post={item}
        />

      ),

      []
    );

  // =========================
  // SCROLL
  // =========================
  const handleScroll =
    useCallback((event: any) => {

      const currentY =
        event.nativeEvent
          .contentOffset.y;

      const diff =
        currentY -
        lastScrollY.current;

      // DOWN
      if (
        diff > 6 &&
        currentY > 40
      ) {

        hideTabBar();
      }

      // UP
      if (
        diff < -6
      ) {

        showTabBar();
      }

      lastScrollY.current =
        currentY;

    }, [
      hideTabBar,
      showTabBar,
    ]);

  // =========================
  // HEADER
  // =========================
  const listHeader =
  useMemo(
    () => (

      <View>

        <HeroCarousel />

        {user && (

          <AppText
            style={{

              marginTop: 20,

              marginBottom: 16,

              marginHorizontal: 16,

              fontWeight:
                'bold',
            }}
          >
            Bienvenido {user.name}
          </AppText>

        )}

      </View>

    ),
    [user]
  );

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
                style={styles.badge}
              >

                <AppText
                  style={
                    styles.badgeText
                  }
                >
                  {unreadCount}
                </AppText>

              </View>

            )}

          </View>
        }
      />

      <View
        style={{
          flex: 1,
        }}
      >

        <FlashList

          data={posts}

          keyExtractor={(item) =>
            item.id
          }

          renderItem={
            renderItem
          }

          // =========================
          // PAGINATION
          // =========================
          onEndReached={
            loadMorePosts
          }

          onEndReachedThreshold={0.4}

          // =========================
          // REFRESH
          // =========================
          refreshControl={

            <RefreshControl
              refreshing={
                refreshing
              }

              onRefresh={
                refreshPosts
              }
            />
          }

          // =========================
          // PERFORMANCE
          // =========================
          scrollEventThrottle={16}

          showsVerticalScrollIndicator={
            false
          }

          keyboardShouldPersistTaps=
            "handled"

          // =========================
          // TABBAR ANIMATION
          // =========================
          onScroll={
            handleScroll
          }

          // =========================
          // HEADER
          // =========================
          ListHeaderComponent={
            listHeader
          }

          // =========================
          // FOOTER
          // =========================
          ListFooterComponent={

            loadingMore
              ? (
                <View
                  style={{
                    paddingVertical: 24,
                  }}
                >
                  <Loader />
                </View>
              )
              : null
          }

          // =========================
          // EMPTY
          // =========================
          ListEmptyComponent={

  loading &&
  posts.length === 0

    ? <FeedSkeleton />

    : (

      <EmptyState
        title=
          "No hay posts todavía."
      />

    )
}

          // =========================
          // CONTENT
          // =========================
          contentContainerStyle={{

  paddingBottom: 140,
}}
        />

      </View>

    </Screen>
  );
}

const styles =
  StyleSheet.create({

    badge: {

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
    },

    badgeText: {

      color: 'white',

      fontSize: 10,

      fontWeight:
        'bold',
    },
  });