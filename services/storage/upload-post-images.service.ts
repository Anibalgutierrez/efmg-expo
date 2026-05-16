import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  storage,
} from '../../firebase/config';

import * as FileSystem
from 'expo-file-system';

export type UploadPostImagesInput = {

  original: string;

  medium: string;

  thumb: string;
};

export type UploadedPostImages = {

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

export async function uploadPostImages({
  original,
  medium,
  thumb,
}: UploadPostImagesInput):
  Promise<
    UploadedPostImages
  > {

  const fileName =
    `${Date.now()}.webp`;

  const originalUrl =
    await uploadSingleImage(

      original,

      `posts/original/${fileName}`
    );

  const mediumUrl =
    await uploadSingleImage(

      medium,

      `posts/medium/${fileName}`
    );

  const thumbUrl =
    await uploadSingleImage(

      thumb,

      `posts/thumb/${fileName}`
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