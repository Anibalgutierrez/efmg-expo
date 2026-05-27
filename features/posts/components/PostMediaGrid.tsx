import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  memo,
  useMemo,
  useState,
} from 'react';

import {
  Image,
} from 'expo-image';

import {
  PostImage,
} from '../types/post.types';

import ImageViewerModal
from './ImageViewerModal';

type Props = {
  postId: string;
  images: PostImage[];
  height: number;
};

function PostMediaGrid({
  postId,
  images,
  height,
}: Props) {

  const [
    viewerVisible,
    setViewerVisible,
  ] = useState(false);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  // =========================
  // IMAGE URLS
  // =========================
  const imageUrls =
    useMemo(() => {

      return images.map(
        (image) =>

          image.original ||
          image.medium ||
          image.thumb,
      );

    }, [images]);

  // =========================
  // OPEN VIEWER
  // =========================
  const openViewer = (
    index: number
  ) => {

    setActiveIndex(
      index
    );

    setViewerVisible(
      true
    );
  };

  // =========================
  // IMAGE ITEM
  // =========================
  const renderImage = (
    image: PostImage,
    index: number,
    customStyle?: any,
    overlayText?: string,
  ) => {

    const imageUrl =

      image.original ||
      image.medium ||
      image.thumb;

    return (

      <Pressable
        key={`${postId}-${index}`}

        onPress={() =>
          openViewer(index)
        }

        style={[
          styles.imageWrapper,
          customStyle,
        ]}
      >

        <Image
          source={{
            uri: imageUrl,
          }}

          recyclingKey={
            `${postId}-${index}`
          }

          cachePolicy=
            "memory-disk"

          contentFit=
            "cover"

          transition={120}

          style={
            styles.image
          }
        />

        {!!overlayText && (

          <View
            style={
              styles.overlay
            }
          >

            <View
              style={
                styles.overlayBackground
              }
            />

          </View>
        )}

      </Pressable>
    );
  };

  // =========================
  // SINGLE
  // =========================
  if (images.length === 1) {

    return (

      <>

        <View
          style={{
            height,
          }}
        >

          {renderImage(
            images[0],
            0,
            {
              height: '100%',
            },
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

  // =========================
  // TWO
  // =========================
  if (images.length === 2) {

    return (

      <>

        <View
          style={[
            styles.row,
            {
              height,
            },
          ]}
        >

          {renderImage(
            images[0],
            0,
            styles.flexImage,
          )}

          {renderImage(
            images[1],
            1,
            styles.flexImage,
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

  // =========================
  // THREE
  // =========================
  if (images.length === 3) {

    return (

      <>

        <View
          style={{
            height,
            gap: 6,
          }}
        >

          {renderImage(
            images[0],
            0,
            {
              flex: 1.3,
            },
          )}

          <View
            style={[
              styles.row,
              {
                flex: 1,
              },
            ]}
          >

            {renderImage(
              images[1],
              1,
              styles.flexImage,
            )}

            {renderImage(
              images[2],
              2,
              styles.flexImage,
            )}

          </View>

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

  // =========================
  // FOUR+
  // =========================
  return (

    <>

      <View
        style={[
          styles.grid,
          {
            height,
          },
        ]}
      >

        {renderImage(
          images[0],
          0,
          styles.flexImage,
        )}

        {renderImage(
          images[1],
          1,
          styles.flexImage,
        )}

        {renderImage(
          images[2],
          2,
          styles.flexImage,
        )}

        {renderImage(
          images[3],
          3,
          styles.flexImage,
          images.length > 4
            ? `+${images.length - 4}`
            : undefined,
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

const styles =
  StyleSheet.create({

    row: {

      flexDirection:
        'row',

      gap: 6,
    },

    grid: {

      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap: 6,
    },

    imageWrapper: {

      flex: 1,

      overflow:
        'hidden',

      borderRadius:
        18,
    },

    flexImage: {

      flex: 1,

      minWidth:
        '48%',

      height:
        '100%',
    },

    image: {

      width: '100%',

      height: '100%',
    },

    overlay: {

      position:
        'absolute',

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    overlayBackground: {

      position:
        'absolute',

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      backgroundColor:
        'rgba(0,0,0,0.38)',
    },
  });

export default memo(
  PostMediaGrid
);