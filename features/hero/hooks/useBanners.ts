import {
  useEffect,
  useState,
} from 'react';

import {
  subscribeToBanners,
} from '../../../services/banners/banners.service';

import {
  Banner,
} from '../types/banner.types';

export default function useBanners() {

  const [
    banners,
    setBanners,
  ] = useState<Banner[]>([]);

  useEffect(() => {

    const unsubscribe =
      subscribeToBanners(
        (
          fetchedBanners
        ) => {

          const processed =
            fetchedBanners

              // =========================
              // ONLY ACTIVE
              // =========================
              .filter(
                (
                  banner
                ) =>

                  banner.active !== false
              )

              // =========================
              // SORT
              // =========================
              .sort(
                (
                  a,
                  b
                ) =>

                  (a.order || 0) -
                  (b.order || 0)
              );

          setBanners(
            processed
          );
        }
      );

    return unsubscribe;

  }, []);

  return {
    banners,
  };
}