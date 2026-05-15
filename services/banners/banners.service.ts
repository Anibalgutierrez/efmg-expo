import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import {
  Banner,
} from '../../types/banner.types';

export async function createBanner(
  banner: Omit<
    Banner,
    'id'
  >
) {

  const bannersRef =
    collection(
      db,
      'banners'
    );

  await addDoc(
    bannersRef,
    banner
  );
}

export function subscribeToBanners(
  callback: (
    banners: Banner[]
  ) => void
) {

  const bannersRef =
    collection(
      db,
      'banners'
    );

  const q = query(
    bannersRef,

    orderBy(
      'order',
      'asc'
    )
  );

  return onSnapshot(
    q,
    (snapshot) => {

      const banners =
        snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (banner: any) =>
              banner.active
          ) as Banner[];

      callback(
        banners
      );
    }
  );
}