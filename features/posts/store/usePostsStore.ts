import {
  create,
} from 'zustand';

import {
  Post,
  PostImage,
} from '../types/post.types';

type PostsStore = {

  posts: Post[];

  setPosts: (
    posts: Post[]
  ) => void;

  mergePosts: (
    posts: Post[]
  ) => void;

  appendPosts: (
    posts: Post[]
  ) => void;

  prependPost: (
    post: Post
  ) => void;

  removePost: (
    postId: string
  ) => void;

  updatePost: (
    postId: string,
    updater: (
      post: Post
    ) => Post
  ) => void;

  updateLikes: (
    postId: string,
    likesCount: number
  ) => void;

  updateComments: (
    postId: string,
    commentsCount: number
  ) => void;

  clearPosts: () => void;
};

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

    prev.likesCount ===
      next.likesCount &&

    prev.commentsCount ===
      next.commentsCount &&

    prev.content ===
      next.content &&

    prev.thumbnail ===
      next.thumbnail &&

    prev.reelUrl ===
      next.reelUrl &&

    prev.user.id ===
      next.user.id &&

    prev.user.name ===
      next.user.name &&

    prev.user.avatar ===
      next.user.avatar &&

    areImagesEqual(
      prev.images,
      next.images
    )
  );
}

export const usePostsStore =
  create<PostsStore>()(

    (set, get) => ({

      posts: [],

      // =========================
      // SET POSTS
      // =========================
      setPosts: (
        posts
      ) => set({
        posts,
      }),

      // =========================
      // MERGE POSTS
      // =========================
      mergePosts: (
        incomingPosts
      ) => set(
        (state) => {

          // QUICK EXIT
          if (
            incomingPosts.length === 0
          ) {

            return state;
          }

          // =========================
          // EXISTING MAP
          // =========================
          const existingMap =
            new Map(

              state.posts.map(
                (post) => [
                  post.id,
                  post,
                ]
              )
            );

          let changed =
            false;

          // =========================
          // MERGED TOP
          // =========================
          const mergedTop =
            incomingPosts.map(
              (incoming) => {

                const existing =
                  existingMap.get(
                    incoming.id
                  );

                // NEW POST
                if (!existing) {

                  changed =
                    true;

                  return incoming;
                }

                // SAME
                if (

                  arePostsEqual(
                    existing,
                    incoming
                  )

                ) {

                  return existing;
                }

                // CHANGED
                changed =
                  true;

                return incoming;
              }
            );

          // =========================
          // KEEP PAGINATED
          // =========================
          const incomingIds =
            new Set(

              incomingPosts.map(
                (post) =>
                  post.id
              )
            );

          const remainingPosts =
            state.posts.filter(
              (post) =>

                !incomingIds.has(
                  post.id
                )
            );

          const finalPosts = [

            ...mergedTop,

            ...remainingPosts,
          ];

          // =========================
          // NO CHANGES
          // =========================
          if (

            !changed &&

            finalPosts.length ===
              state.posts.length

          ) {

            return state;
          }

          return {
            posts:
              finalPosts,
          };
        }
      ),

      // =========================
      // APPEND POSTS
      // =========================
      appendPosts: (
        newPosts
      ) => {

        if (
          newPosts.length === 0
        ) {
          return;
        }

        const existingIds =
          new Set(
            get().posts.map(
              (post) =>
                post.id
            )
          );

        const filtered =
          newPosts.filter(
            (post) =>

              !existingIds.has(
                post.id
              )
          );

        if (
          filtered.length === 0
        ) {
          return;
        }

        set(
          (state) => ({

            posts: [

              ...state.posts,

              ...filtered,
            ],
          })
        );
      },

      // =========================
      // PREPEND POST
      // =========================
      prependPost: (
        newPost
      ) => set(
        (state) => ({

          posts: [

            newPost,

            ...state.posts.filter(
              (post) =>

                post.id !==
                newPost.id
            ),
          ],
        })
      ),

      // =========================
      // REMOVE POST
      // =========================
      removePost: (
        postId
      ) => set(
        (state) => ({

          posts:
            state.posts.filter(
              (post) =>

                post.id !==
                postId
            ),
        })
      ),

      // =========================
      // GENERIC UPDATE
      // =========================
      updatePost: (
        postId,
        updater
      ) => set(
        (state) => ({

          posts:
            state.posts.map(
              (post) =>

                post.id ===
                  postId

                  ? updater(post)

                  : post
            ),
        })
      ),

      // =========================
      // UPDATE LIKES
      // =========================
      updateLikes: (
        postId,
        likesCount
      ) => set(
        (state) => ({

          posts:
            state.posts.map(
              (post) =>

                post.id ===
                  postId

                  ? {

                      ...post,

                      likesCount,
                    }

                  : post
            ),
        })
      ),

      // =========================
      // UPDATE COMMENTS
      // =========================
      updateComments: (
        postId,
        commentsCount
      ) => set(
        (state) => ({

          posts:
            state.posts.map(
              (post) =>

                post.id ===
                  postId

                  ? {

                      ...post,

                      commentsCount,
                    }

                  : post
            ),
        })
      ),

      // =========================
      // CLEAR POSTS
      // =========================
      clearPosts: () =>
        set({
          posts: [],
        }),
    })
  );