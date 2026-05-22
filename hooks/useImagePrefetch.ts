import {
  useEffect,
  useMemo,
} from 'react';

import {
  Image,
} from 'expo-image';

export default function useImagePrefetch(
  urls: string[]
) {

  const uniqueUrls =
    useMemo(() => {

      return [

        ...new Set(

          urls.filter(
            Boolean
          )
        ),
      ];

    }, [urls]);

  useEffect(() => {

    if (
      uniqueUrls.length === 0
    ) {
      return;
    }

    async function preload() {

      try {

        await Promise.all(

          uniqueUrls.map(
            async (url) => {

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

  }, [uniqueUrls]);
}