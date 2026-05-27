import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Banner,
} from '../types/banner.types';

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

  const bannersQuery =
    query(

      bannersRef,

      orderBy(
        'createdAt',
        'desc'
      )
    );

  const unsubscribe =
    onSnapshot(
      bannersQuery,

      (snapshot) => {

        const banners:
          Banner[] = [];

        snapshot.forEach(
          (doc) => {

            banners.push({

              id:
                doc.id,

              ...(doc.data() as Omit<
                Banner,
                'id'
              >),
            });
          }
        );

        callback(
          banners
        );
      }
    );

  return unsubscribe;
}