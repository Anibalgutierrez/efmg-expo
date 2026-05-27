
import {
  Dimensions,
  Platform,
  View,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';

import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';

import { Ionicons } from '@expo/vector-icons';

import {
  WebView,
} from 'react-native-webview';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import usePosts
  from '../../features/posts/hooks/usePosts';

import useVideoPrefetch
  from '../../hooks/useVideoPrefetch';

import {
  Post,
} from '../../features/posts/types/post.types';

const {
  height: WINDOW_HEIGHT,
} = Dimensions.get(
  'window'
);

// =========================
// HELPERS
// =========================
function getEmbedUrl(
  url: string
) {

  const match =
    url.match(
      /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/
    );

  if (!match) {
    return '';
  }

  const videoId =
    match[1];

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&playsinline=1&rel=0&modestbranding=1`;
}

// =========================
// REEL PLAYER
// =========================
const ReelPlayer = memo(
  ({
    embedUrl,
  }: {
    embedUrl: string;
  }) => {

    // WEB
    if (
      Platform.OS ===
      'web'
    ) {

      return (

        <iframe
          src={embedUrl}

          loading="lazy"

          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}

          allow="autoplay; fullscreen"

          allowFullScreen
        />

      );
    }

    // MOBILE
    return (

      <WebView
        source={{
          uri: embedUrl,
        }}

        style={{
          flex: 1,
          backgroundColor:
            'black',
        }}

        javaScriptEnabled

        domStorageEnabled

        allowsFullscreenVideo

        allowsInlineMediaPlayback

        mediaPlaybackRequiresUserAction={
          false
        }

        scrollEnabled={
          false
        }

        originWhitelist={[
          '*',
        ]}

        setSupportMultipleWindows={
          false
        }
      />

    );
  }
);

// =========================
// REEL ITEM
// =========================
const ReelItem = memo(
  ({
    item,
    isActive,
  }: {
    item: Post;
    isActive: boolean;
  }) => {

    const embedUrl =
      isActive
        ? getEmbedUrl(
          item.reelUrl || ''
        )
        : 'about:blank';

    return (

      <View
        style={{
          width: '100%',
          height:
            WINDOW_HEIGHT,
          backgroundColor:
            'black',
        }}
      >

        <ReelPlayer
          embedUrl={
            embedUrl
          }
        />

      </View>

    );
  }
);

// =========================
// SCREEN
// =========================
export default function ReelsScreen() {

  const router =
    useRouter();

  const params =
    useLocalSearchParams();

  const {
    posts,
  } = usePosts();

  // =========================
  // FILTER REELS
  // =========================
  const reels =
    useMemo(
      () =>

        posts.filter(
          (post) =>
            post.type ===
            'reel'
        ),

      [posts]
    );

  // =========================
  // PREFETCH
  // =========================
  const videoUrls =
    reels
      .map(
        (reel) =>
          reel.reelUrl
      )
      .filter(
        Boolean
      ) as string[];

  useVideoPrefetch(
    videoUrls
  );

  // =========================
  // INITIAL INDEX
  // =========================
  const reelId =
    typeof params.reelId ===
      'string'
      ? params.reelId
      : '';

  const initialIndex =
    useMemo(() => {

      const found =
        reels.findIndex(
          (reel) =>
            reel.id ===
            reelId
        );

      return found >= 0
        ? found
        : 0;

    }, [
      reelId,
      reels,
    ]);

  // =========================
  // ACTIVE INDEX
  // =========================
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(
    initialIndex
  );

  useEffect(() => {

    setActiveIndex(
      initialIndex
    );

  }, [
    initialIndex,
  ]);

  const listRef =
    useRef<any>(
      null
    );

  // =========================
  // VIEWABILITY
  // =========================
  const onViewableItemsChanged =
    useRef(
      ({
        viewableItems,
      }: any) => {

        if (
          viewableItems?.length >
          0
        ) {

          const index =
            viewableItems[0]
              ?.index ?? 0;

          setActiveIndex(
            index
          );
        }
      }
    ).current;

  const viewabilityConfig =
    useRef({

      itemVisiblePercentThreshold:
        80,

    }).current;

  // =========================
  // RENDER ITEM
  // =========================
  const renderItem =
    useCallback(
      ({
        item,
        index,
      }: {
        item: Post;
        index: number;
      }) => (

        <ReelItem
          item={item}

          isActive={
            index ===
            activeIndex
          }
        />

      ),

      [activeIndex]
    );

  // =========================
  // KEY
  // =========================
  const keyExtractor =
    useCallback(
      (
        item: Post
      ) => item.id,

      []
    );

  return (

    <View
      style={
        styles.container
      }
    >

      <FlatList
        ref={listRef}

        data={reels}

        renderItem={
          renderItem
        }

        keyExtractor={
          keyExtractor
        }

        pagingEnabled

        decelerationRate="fast"

        snapToAlignment="start"

        showsVerticalScrollIndicator={
          false
        }

        removeClippedSubviews={
          Platform.OS !== 'web'
        }

        initialScrollIndex={
          initialIndex
        }

        onViewableItemsChanged={
          onViewableItemsChanged
        }

        viewabilityConfig={
          viewabilityConfig
        }

        windowSize={2}

        maxToRenderPerBatch={1}

        initialNumToRender={1}

        updateCellsBatchingPeriod={50}

        getItemLayout={(
          _,
          index
        ) => ({

          length:
            WINDOW_HEIGHT,

          offset:
            WINDOW_HEIGHT * index,

          index,
        })}
      />

      {/* BACK BUTTON */}
      <View
        style={{
          ...styles.overlay,

          pointerEvents:
            'box-none',
        }}
      >

        <Pressable
          onPress={() =>
            router.back()
          }

          hitSlop={30}

          style={
            styles.backButton
          }
        >

          <Ionicons
            name="arrow-back"

            size={28}

            color="white"
          />

        </Pressable>

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        'black',
    },

    overlay: {
      position:
        'absolute',

      top: 0,
      left: 0,
      right: 0,

      zIndex:
        999,
    },

    backButton: {

      marginTop: 20,
      marginLeft: 20,

      width: 56,
      height: 56,

      borderRadius: 999,

      backgroundColor:
        'rgba(0,0,0,0.7)',

      justifyContent:
        'center',

      alignItems:
        'center',
    },
  });