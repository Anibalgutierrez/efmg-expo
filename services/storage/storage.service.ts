import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  manipulateAsync,
  SaveFormat,
} from 'expo-image-manipulator';

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

export async function uploadImage(
  uri: string,
  folder: string = 'posts'
): Promise<UploadedImageSizes> {

  const filename =
    `${Date.now()}`;

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