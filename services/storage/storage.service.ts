import {
  Platform,
} from 'react-native';

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  manipulateAsync,
  SaveFormat,
} from 'expo-image-manipulator';

import imageCompression
from 'browser-image-compression';

import {
  storage,
} from '../../firebase/config';

export type UploadedImageSizes = {

  original: string;

  medium: string;

  thumb: string;
};

async function uploadSingleImage(
  uri: string,
  path: string
) {

  const response =
    await fetch(uri);

  const blob =
    await response.blob();

  const storageRef =
    ref(
      storage,
      path
    );

  await uploadBytes(
    storageRef,
    blob
  );

  return await getDownloadURL(
    storageRef
  );
}

// =========================
// WEB IMAGE COMPRESS
// =========================
async function compressWebImage(
  uri: string
) {

  const response =
    await fetch(uri);

  const blob =
    await response.blob();

  const file =
    new File(

      [blob],

      'image.jpg',

      {
        type:
          blob.type ||
          'image/jpeg',
      }
    );

  return await imageCompression(
    file,

    {
      maxSizeMB: 0.5,

      maxWidthOrHeight: 1600,

      useWebWorker: true,
    }
  );
}

export async function uploadImage(
  uri: string,
  folder: string = 'posts'
): Promise<UploadedImageSizes> {

  const filename =
    `${Date.now()}`;

  // =========================
  // WEB
  // =========================
  if (

    Platform.OS === 'web' &&

    [
      'banners',
      'avatars',
    ].includes(folder)
  ) {

    const compressedFile =
      await compressWebImage(
        uri
      );

    const storageRef =
      ref(

        storage,

        `${folder}/${filename}.jpg`
      );

    await uploadBytes(
      storageRef,
      compressedFile
    );

    const url =
      await getDownloadURL(
        storageRef
      );

    return {

      original: url,

      medium: url,

      thumb: url,
    };
  }

  // =========================
  // ORIGINAL
  // =========================
  const originalUrl =
    await uploadSingleImage(

      uri,

      `${folder}/original/${filename}.webp`
    );

  // =========================
  // MEDIUM
  // =========================
  const mediumImage =
    await manipulateAsync(

      uri,

      [
        {
          resize: {
            width: 900,
          },
        },
      ],

      {

        compress: 0.7,

        format:
          SaveFormat.WEBP,
      }
    );

  const mediumUrl =
    await uploadSingleImage(

      mediumImage.uri,

      `${folder}/medium/${filename}.webp`
    );

  // =========================
  // THUMB
  // =========================
  const thumbImage =
    await manipulateAsync(

      uri,

      [
        {
          resize: {
            width: 300,
          },
        },
      ],

      {

        compress: 0.6,

        format:
          SaveFormat.WEBP,
      }
    );

  const thumbUrl =
    await uploadSingleImage(

      thumbImage.uri,

      `${folder}/thumb/${filename}.webp`
    );

  return {

    original:
      originalUrl,

    medium:
      mediumUrl,

    thumb:
      thumbUrl,
  };
}