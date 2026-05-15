import {
  Dimensions,
  FlatList,
  Platform,
  View,
  Pressable,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  WebView,
} from 'react-native-webview';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useRef,
  useState,
} from 'react';

import Screen
from '../../components/ui/Screen';

import usePosts
from '../../features/posts/hooks/usePosts';

import {
  Post,
} from '../../types/post.types';

const {
  height,
} = Dimensions.get(
  'window'
);

export default function ReelsScreen() {

  const router =
    useRouter();

  const params =
    useLocalSearchParams();

  const {
    posts,
  } = usePosts();

  const reels =
    posts.filter(
      (post) =>
        post.type ===
        'reel'
    );

  const reelId =
    typeof params.reelId ===
    'string'
      ? params.reelId
      : '';

  const initialIndex =
    reels.findIndex(
      (reel) =>
        reel.id ===
        reelId
    );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(
    initialIndex >= 0
      ? initialIndex
      : 0
  );

  const onViewRef =
    useRef(
      ({
        viewableItems,
      }: any) => {

        if (
          viewableItems.length >
          0
        ) {

          setActiveIndex(
            viewableItems[0]
              .index
          );
        }
      }
    );

  const viewConfigRef =
    useRef({
      itemVisiblePercentThreshold:
        80,
    });

  function getEmbedUrl(
    url: string
  ) {

    const match =
      url.match(
        /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/
      );

    if (!match) {
      return url;
    }

    const videoId =
      match[1];

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&playsinline=1&rel=0`;
  }

  function renderItem({
    item,
    index,
  }: {
    item: Post;
    index: number;
  }) {

    if (!item.reelUrl) {
      return null;
    }

    const isActive =
      index ===
      activeIndex;

    const embedUrl =
      isActive
        ? getEmbedUrl(
            item.reelUrl
          )
        : 'about:blank';

    return (

      <View
        style={{
          height,
          backgroundColor:
            'black',
        }}
      >

        {Platform.OS ===
        'web' ? (

          <iframe
            src={embedUrl}

            style={{

              width: '100%',

              height: '100%',

              border: 'none',
            }}

            allow="autoplay; fullscreen"

            allowFullScreen
          />

        ) : (

          <WebView
            source={{
              uri:
                embedUrl,
            }}

            style={{
              flex: 1,
            }}

            javaScriptEnabled

            allowsFullscreenVideo
          />

        )}

      </View>
    );
  }

  return (

    <Screen>

  <FlatList
    data={reels}
    renderItem={renderItem}
    keyExtractor={(item) => item.id}
    pagingEnabled
    showsVerticalScrollIndicator={false}
    initialScrollIndex={
      initialIndex >= 0
        ? initialIndex
        : 0
    }
    getItemLayout={(_, index) => ({
      length: height,
      offset: height * index,
      index,
    })}
  />

  <View
    pointerEvents="box-none"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999999,
      elevation: 999999,
    }}
  >

    <Pressable
      onPress={() =>
        router.replace(
          '/(tabs)'
        )
      }

      hitSlop={30}

      style={{
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
      }}
    >

      <Ionicons
        name="arrow-back"
        size={28}
        color="white"
      />

    </Pressable>

  </View>

</Screen>
  );
}