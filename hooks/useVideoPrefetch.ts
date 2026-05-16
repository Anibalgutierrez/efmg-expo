import {
  useEffect,
} from 'react';

import {
  Video,
} from 'expo-video';

export default function useVideoPrefetch(
  urls: string[]
) {

  useEffect(() => {

    if (
      !urls?.length
    ) return;

    const players: Video[] = [];

    async function preload() {

      try {

        for (const url of urls) {

          if (!url) continue;

          try {

            const player =
              new Video();

            await player.loadAsync({
              uri: url,
            });

            players.push(
              player
            );

          } catch {}
        }

      } catch {}
    }

    preload();

    return () => {

      players.forEach(
        async (player) => {

          try {

            await player.unloadAsync();

          } catch {}
        }
      );
    };

  }, [urls]);
}