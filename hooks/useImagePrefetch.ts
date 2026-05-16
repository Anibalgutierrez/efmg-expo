import {
  useEffect,
} from 'react';

import {
  Image,
} from 'expo-image';

export default function useImagePrefetch(
  urls: string[]
) {

  useEffect(() => {

    if (
      !urls?.length
    ) return;

    async function preload() {

      try {

        await Promise.all(

          urls.map(
            async (url) => {

              if (!url) return;

              try {

                await Image.prefetch(
                  url
                );

              } catch {}
            }
          )
        );

      } catch {}
    }

    preload();

  }, [urls]);
}