import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Banner,
} from '../types/banner.types';

type CreateBannerData = Omit<
  Banner,
  'id' | 'createdAt'
>;

export async function createBanner(
  data: CreateBannerData
) {

  const bannersRef =
    collection(
      db,
      'banners'
    );

  const payload = {

    ...data,

    createdAt:
      serverTimestamp(),
  };

  const docRef =
    await addDoc(
      bannersRef,
      payload
    );

  return docRef.id;
}