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