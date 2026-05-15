import {
  useEffect,
  useState,
} from 'react';

import {
  subscribeToUserPosts,
} from '../../../services/posts/user-posts.service';

import {
  Post,
} from '../../../types/post.types';

export default function useUserPosts(
  userId: string
) {

  const [
    posts,
    setPosts,
  ] = useState<Post[]>([]);

  useEffect(() => {

    if (!userId) {
      setPosts([]);
      return;
    }

    const unsubscribe =
      subscribeToUserPosts(
        userId,
        setPosts
      );

    return unsubscribe;

  }, [userId]);

  return {
    posts,
  };
}