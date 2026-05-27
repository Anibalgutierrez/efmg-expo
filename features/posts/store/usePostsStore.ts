import {
  create,
} from 'zustand';

import {
  Post,
} from '../types/post.types';

type PostsStore = {

  posts: Post[];

  setPosts: (
    posts: Post[]
  ) => void;

  // =========================
  // NEW
  // =========================
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

          const existingMap =
            new Map(

              state.posts.map(
                (post) => [
                  post.id,
                  post,
                ]
              )
            );

          const mergedTop =
            incomingPosts.map(
              (incoming) => {

                const existing =
                  existingMap.get(
                    incoming.id
                  );

                // NEW POST
                if (!existing) {
                  return incoming;
                }

                // SAME DATA
                const isSame =

                  existing.likesCount ===
                    incoming.likesCount &&

                  existing.commentsCount ===
                    incoming.commentsCount &&

                  existing.content ===
                    incoming.content &&

                  JSON.stringify(
                    existing.images
                  ) ===
                  JSON.stringify(
                    incoming.images
                  ) &&

                  existing.thumbnail ===
                    incoming.thumbnail;

                // PRESERVE REFERENCE
                return isSame
                  ? existing
                  : incoming;
              }
            );

          // KEEP PAGINATED POSTS
          const remainingPosts =
            state.posts.filter(
              (post) =>

                !incomingPosts.some(
                  (incoming) =>

                    incoming.id ===
                    post.id
                )
            );

          return {

            posts: [

              ...mergedTop,

              ...remainingPosts,
            ],
          };
        }
      ),

      // =========================
      // APPEND POSTS
      // =========================
      appendPosts: (
        newPosts
      ) => {

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