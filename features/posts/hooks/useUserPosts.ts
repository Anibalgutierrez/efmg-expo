import {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  subscribeToUserPosts,
} from '../../../services/posts/user-posts.service';

import {
  Post,
} from '../types/post.types';

export default function useUserPosts(
  userId: string
) {

  const [
    posts,
    setPosts,
  ] = useState<Post[]>([]);

  const initializedRef =
    useRef(false);

  useEffect(() => {

    if (!userId) {

      setPosts([]);

      initializedRef.current =
        false;

      return;
    }

    const unsubscribe =
      subscribeToUserPosts(
        userId,
        (
          incomingPosts
        ) => {

          setPosts(
            (prevPosts) => {

              // =========================
              // FIRST LOAD
              // =========================
              if (
                !initializedRef.current
              ) {

                initializedRef.current =
                  true;

                return incomingPosts;
              }

              // =========================
              // MERGE
              // =========================
              const prevMap =
                new Map(

                  prevPosts.map(
                    (post) => [
                      post.id,
                      post,
                    ]
                  )
                );

              let changed =
                false;

              const merged =
                incomingPosts.map(
                  (
                    incomingPost
                  ) => {

                    const existing =
                      prevMap.get(
                        incomingPost.id
                      );

                    // =========================
                    // NEW POST
                    // =========================
                    if (
                      !existing
                    ) {

                      changed =
                        true;

                      return incomingPost;
                    }

                    // =========================
                    // CHANGE DETECT
                    // =========================
                    const hasChanged =

                      existing.likesCount !==
                        incomingPost.likesCount ||

                      existing.commentsCount !==
                        incomingPost.commentsCount ||

                      existing.content !==
                        incomingPost.content ||

                      existing.thumbnail !==
                        incomingPost.thumbnail ||

                      existing.user?.avatar !==
                        incomingPost.user?.avatar ||

                      existing.user?.name !==
                        incomingPost.user?.name ||

                      existing.reelUrl !==
                        incomingPost.reelUrl;

                    if (
                      hasChanged
                    ) {

                      changed =
                        true;

                      return incomingPost;
                    }

                    // =========================
                    // KEEP OLD REFERENCE
                    // =========================
                    return existing;
                  }
                );

              // =========================
              // REMOVE DETECT
              // =========================
              if (
                prevPosts.length !==
                merged.length
              ) {

                changed =
                  true;
              }

              return changed
                ? merged
                : prevPosts;
            }
          );
        }
      );

    return () =>
      unsubscribe();

  }, [userId]);

  return {
    posts,
  };
}