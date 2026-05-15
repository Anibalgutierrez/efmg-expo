import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { storage }
from '../../firebase/config';

export async function uploadImage(
  uri: string,
  folder: string = 'posts'
) {
  const response =
    await fetch(uri);

  const blob =
    await response.blob();

  const filename =
    `${Date.now()}`;

  const storageRef = ref(
    storage,
    `${folder}/${filename}`
  );

  await uploadBytes(
    storageRef,
    blob
  );

  const downloadURL =
    await getDownloadURL(
      storageRef
    );

  return downloadURL;
}