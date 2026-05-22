import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  View,
} from 'react-native';

import {
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Image,
} from 'expo-image';

import {
  PostImage,
} from '../../../types/post.types';

import ImageViewerModal
from './ImageViewerModal';

type Props = {
  postId: string;
  images: PostImage[];
  height: number;
};

export default function PostMediaCarousel({
  postId,
  images,
  height,
}: Props) {

  const flatListRef =
    useRef<FlatList>(
      null
    );

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const [
    viewerVisible,
    setViewerVisible,
  ] = useState(false);

  const [
    mediaWidth,
    setMediaWidth,
  ] = useState(0);

  const imageUrls =
    useMemo(() => {

      return images.map(
        (image) =>

          image.original ||
          image.medium ||
          image.thumb,
      );

    }, [images]);

  if (!mediaWidth) {

    return (

      <View
        onLayout={(
          event: LayoutChangeEvent
        ) => {

          setMediaWidth(

            event.nativeEvent
              .layout.width
          );
        }}

        style={{
          width: '100%',
          height,
        }}
      />

    );
  }

  return (

    <>

      <View

        onLayout={(
          event: LayoutChangeEvent
        ) => {

          const width =
            event.nativeEvent
              .layout.width;

          if (
            width !==
            mediaWidth
          ) {

            setMediaWidth(
              width
            );
          }
        }}

        style={{

          width: '100%',

          overflow:
            'hidden',

          borderRadius:
            18,
        }}
      >

        <FlatList
          ref={
            flatListRef
          }

          horizontal

          pagingEnabled

          data={images}

          keyExtractor={(
            _,
            index
          ) =>
            `${postId}-${index}`
          }

          showsHorizontalScrollIndicator={
            false
          }

          snapToInterval={
            mediaWidth
          }

          decelerationRate="fast"

          bounces={false}

          overScrollMode="never"

          scrollEventThrottle={16}

onScroll={(event) => {

  const offsetX =
    event.nativeEvent
      .contentOffset.x;

  const index =
    Math.round(
      offsetX / mediaWidth
    );

  if (
    index !== activeIndex
  ) {

    setActiveIndex(
      index
    );
  }
}}

          renderItem={({
            item,
            index,
          }) => {

            const imageUrl =

              item.original ||
              item.medium ||
              item.thumb;

            return (

              <Pressable
                onPress={() => {

                  setActiveIndex(
                    index
                  );

                  setViewerVisible(
                    true
                  );
                }}

                style={{
                  width:
                    mediaWidth,
                }}
              >

                <Image
                  source={{
                    uri:
                      imageUrl,
                  }}

                  recyclingKey={
                    `${postId}-${index}`
                  }

                  cachePolicy=
                    "memory-disk"

                  contentFit=
                    "cover"

                  transition={
                    120
                  }

                  style={{

                    width:
                      '100%',

                    height,

                    borderRadius:
                      18,
                  }}
                />

              </Pressable>
            );
          }}
        />

        {images.length > 1 && (

          <View
            pointerEvents="none"

            style={{

              position:
                'absolute',

              bottom: 14,

              left: 0,

              right: 0,

              flexDirection:
                'row',

              justifyContent:
                'center',

              alignItems:
                'center',

              gap: 6,
            }}
          >

            {images.map((
              _,
              index
            ) => {

              const active =

                activeIndex ===
                index;

              return (

                <View
                  key={index}

                  style={{

                    width:
                      active
                        ? 18
                        : 8,

                    height: 8,

                    borderRadius:
                      999,

                    backgroundColor:
                      active

                        ? '#ffffff'

                        : 'rgba(255,255,255,0.45)',
                  }}
                />
              );
            })}

          </View>
        )}

      </View>

      <ImageViewerModal
        visible={
          viewerVisible
        }

        images={
          imageUrls
        }

        initialIndex={
          activeIndex
        }

        onClose={() =>

          setViewerVisible(
            false
          )
        }
      />

    </>
  );
}