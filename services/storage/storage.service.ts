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
    Platform.OS === 'web'
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
  // MOBILE
  // =========================
  const compressed =
    await manipulateAsync(

      uri,

      [
        {
          resize: {
            width: 1200,
          },
        },
      ],

      {
        compress: 0.75,

        format:
          SaveFormat.WEBP,
      }
    );

  const url =
    await uploadSingleImage(

      compressed.uri,

      `${folder}/${filename}.webp`
    );

  return {
    original: url,
    medium: url,
    thumb: url,
  };
}