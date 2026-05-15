import {
  useEffect,
  useState,
} from 'react';

import {
  subscribeToFeed,
} from '../../../services/feed/feed.service';

import { Post }
from '../../../types/post.types';

export default function useFeed(
  userId?: string
) {
  const [posts, setPosts] =
    useState<Post[]>([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe =
      subscribeToFeed(
        userId,
        setPosts
      );

    return () => {
      unsubscribe.then(
        (fn) => fn()
      );
    };
  }, [userId]);

  return {
    posts,
  };
}