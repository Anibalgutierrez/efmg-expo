import {
  useEffect,
  useState,
} from 'react';

import {
  subscribeToBanners,
} from '../../../services/banners/banners.service';

import {
  Banner,
} from '../../../types/banner.types';

export default function useBanners() {

  const [
    banners,
    setBanners,
  ] = useState<Banner[]>([]);

  useEffect(() => {

    const unsubscribe =
      subscribeToBanners(
        setBanners
      );

    return unsubscribe;

  }, []);

  return {
    banners,
  };
}