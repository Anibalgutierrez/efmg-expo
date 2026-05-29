import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import {
  memo,
  useCallback,
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

// =========================
// IMAGE COMPARE
// =========================
function areImagesEqual(
  prevImages: PostImage[],
  nextImages: PostImage[],
) {

  if (
    prevImages === nextImages
  ) {
    return true;
  }

  if (
    prevImages.length !==
    nextImages.length
  ) {
    return false;
  }

  for (
    let i = 0;
    i < prevImages.length;
    i++
  ) {

    const prev =
      prevImages[i];

    const next =
      nextImages[i];

    if (

      prev.original !==
        next.original ||

      prev.medium !==
        next.medium ||

      prev.thumb !==
        next.thumb

    ) {

      return false;
    }
  }

  return true;
}

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

          // FEED = NEVER ORIGINAL
          image.medium ||
          image.thumb
      );

    }, [images]);

  // =========================
  // OPEN VIEWER
  // =========================
  const openViewer =
    useCallback((
      index: number
    ) => {

      setActiveIndex(
        index
      );

      setViewerVisible(
        true
      );

    }, []);

  // =========================
  // CLOSE VIEWER
  // =========================
  const closeViewer =
    useCallback(() => {

      setViewerVisible(
        false
      );

    }, []);

  // =========================
  // IMAGE ITEM
  // =========================
  const renderImage = (
    image: PostImage,
    index: number,
    customStyle?: any,
  ) => {

    // =========================
    // FEED IMAGE
    // =========================
    const imageUrl =

      image.medium ||
      image.thumb;

    // SAFETY
    if (!imageUrl) {
      return null;
    }

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

          transition={80}

          allowDownscaling

          style={
            styles.image
          }
        />

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

        {/* MOUNT ONLY WHEN OPEN */}
        {viewerVisible && (

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

            onClose={
              closeViewer
            }
          />

        )}

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

        {viewerVisible && (

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

            onClose={
              closeViewer
            }
          />

        )}

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

        {viewerVisible && (

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

            onClose={
              closeViewer
            }
          />

        )}

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
        )}

      </View>

      {viewerVisible && (

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

          onClose={
            closeViewer
          }
        />

      )}

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
  });

export default memo(
  PostMediaGrid,
  (
    prev,
    next
  ) => {

    return (

      prev.postId ===
        next.postId &&

      prev.height ===
        next.height &&

      areImagesEqual(
        prev.images,
        next.images
      )
    );
  }
);