import {
  Pressable,
  StyleSheet,
  View,
  Image as RNImage,
} from 'react-native';

import {
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
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

  const [
    aspectRatio,
    setAspectRatio,
  ] = useState(1);

  // =========================
  // IMAGE URLS
  // =========================
  const imageUrls =
    useMemo(() => {

      return images.map(
        (image) =>

          image.medium ||
          image.thumb
      );

    }, [images]);

  // =========================
  // SINGLE IMAGE RATIO
  // =========================
  useEffect(() => {

    if (
      images.length !== 1
    ) {
      return;
    }

    const imageUrl =

      images[0].medium ||
      images[0].thumb;

    if (!imageUrl) {
      return;
    }

    RNImage.getSize(

      imageUrl,

      (
        width,
        height
      ) => {

        if (
          width > 0 &&
          height > 0
        ) {

          setAspectRatio(
            width / height
          );
        }
      },

      () => {

        setAspectRatio(1);
      }
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

    const imageUrl =

      image.medium ||
      image.thumb;

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
            width: '100%',
          }}
        >

          {renderImage(
            images[0],
            0,
            {
              aspectRatio,
            },
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
            visible={viewerVisible}
            images={imageUrls}
            initialIndex={activeIndex}
            onClose={closeViewer}
          />
        )}
      </>
    );
  }

  // El resto del componente (3 imágenes y 4+) queda exactamente igual...

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