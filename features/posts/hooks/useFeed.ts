import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  subscribeToFeed,
} from '../../../services/feed/feed.service';

import {
  Post,
  PostImage,
} from '../types/post.types';

// =========================
// IMAGE COMPARE
// =========================
function areImagesEqual(
  prevImages?: PostImage[],
  nextImages?: PostImage[],
) {

  if (
    prevImages === nextImages
  ) {
    return true;
  }

  if (
    !prevImages &&
    !nextImages
  ) {
    return true;
  }

  if (
    !prevImages ||
    !nextImages
  ) {
    return false;
  }

  if (
    prevImages.length !==
    nextImages.length
  ) {
    return false;
  }

  for (
    let i = 0;
    i < prevImages.length;
    i++
  ) {

    const prev =
      prevImages[i];

    const next =
      nextImages[i];

    if (

      prev.original !==
        next.original ||

      prev.medium !==
        next.medium ||

      prev.thumb !==
        next.thumb

    ) {

      return false;
    }
  }

  return true;
}

// =========================
// POST COMPARE
// =========================
function arePostsEqual(
  prev: Post,
  next: Post,
) {

  return (

    // BASIC
    prev.id ===
      next.id &&

    prev.type ===
      next.type &&

    prev.content ===
      next.content &&

    // COUNTS
    prev.likesCount ===
      next.likesCount &&

    prev.commentsCount ===
      next.commentsCount &&

    // MEDIA
    prev.thumbnail ===
      next.thumbnail &&

    prev.reelUrl ===
      next.reelUrl &&

    areImagesEqual(
      prev.images,
      next.images
    ) &&

    // USER
    prev.user.id ===
      next.user.id &&

    prev.user.name ===
      next.user.name &&

    prev.user.avatar ===
      next.user.avatar &&

    // DATE
    prev.createdAt?.seconds ===
      next.createdAt?.seconds
  );
}

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

    // =========================
    // RESET
    // =========================
    if (!userId) {

      initializedRef.current =
        false;

      setPosts([]);

      return;
    }

    // =========================
    // SUBSCRIBE
    // =========================
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
              // QUICK EMPTY CHECK
              // =========================
              if (

                prevPosts.length === 0 &&

                incomingPosts.length === 0

              ) {

                return prevPosts;
              }

              // =========================
              // QUICK SAME LENGTH CHECK
              // =========================
              if (

                prevPosts.length ===
                incomingPosts.length

              ) {

                let hasAnyChange =
                  false;

                for (
                  let i = 0;
                  i < incomingPosts.length;
                  i++
                ) {

                  const prev =
                    prevPosts[i];

                  const incoming =
                    incomingPosts[i];

                  // ORDER CHANGED
                  if (

                    prev?.id !==
                    incoming?.id

                  ) {

                    hasAnyChange =
                      true;

                    break;
                  }

                  // CONTENT CHANGED
                  if (

                    !arePostsEqual(
                      prev,
                      incoming
                    )

                  ) {

                    hasAnyChange =
                      true;

                    break;
                  }
                }

                // KEEP SAME ARRAY
                if (
                  !hasAnyChange
                ) {

                  return prevPosts;
                }
              }

              // =========================
              // PREV MAP
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

                    // NEW
                    if (
                      !existing
                    ) {

                      return incomingPost;
                    }

                    // SAME
                    if (

                      arePostsEqual(
                        existing,
                        incomingPost
                      )

                    ) {

                      return existing;
                    }

                    // CHANGED
                    return incomingPost;
                  }
                );

              return merged;
            }
          );
        }
      );

    // =========================
    // CLEANUP
    // =========================
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