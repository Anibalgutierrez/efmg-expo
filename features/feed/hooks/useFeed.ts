import {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  subscribeToFeed,
} from '../../../services/feed/feed.service';

import {
  Post,
} from '../../posts/types/post.types';

export default function useFeed(
  userId?: string
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

      return;
    }

    const unsubscribe =
      subscribeToFeed(
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
              // MAP
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

              // =========================
              // MERGE
              // =========================
              const merged =
                incomingPosts.map(
                  (
                    incomingPost
                  ) => {

                    const existing =
                      prevMap.get(
                        incomingPost.id
                      );

                    // NEW POST
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
                        incomingPost.thumbnail;

                    if (
                      hasChanged
                    ) {

                      changed =
                        true;

                      return incomingPost;
                    }

                    // KEEP OLD REFERENCE
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