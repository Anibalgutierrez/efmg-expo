import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  create,
} from 'zustand';

import {
  persist,
  createJSONStorage,
} from 'zustand/middleware';

import {
  Comment,
} from '../types/comment.types';

type CommentsMap = {

  [postId: string]:
    Comment[];
};

type CommentsStore = {

  commentsByPost:
    CommentsMap;

  // =========================
  // SET COMMENTS
  // =========================
  setComments: (

    postId: string,

    comments: Comment[]
  ) => void;

  // =========================
  // APPEND COMMENTS
  // =========================
  appendComments: (

    postId: string,

    comments: Comment[]
  ) => void;

  // =========================
  // PREPEND COMMENT
  // =========================
  prependComment: (

    postId: string,

    comment: Comment
  ) => void;

  // =========================
  // UPDATE COMMENT
  // =========================
  updateComment: (

    postId: string,

    commentId: string,

    updater: (
      comment: Comment
    ) => Comment
  ) => void;

  // =========================
  // REMOVE COMMENT
  // =========================
  removeComment: (

    postId: string,

    commentId: string
  ) => void;

  // =========================
  // CLEAR COMMENTS
  // =========================
  clearComments: (
    postId: string
  ) => void;
};

export const useCommentsStore =
  create<CommentsStore>()(

    persist(

      (set) => ({

        commentsByPost: {},

        // =========================
        // SET
        // =========================
        setComments: (

          postId,
          comments
        ) =>

          set((state) => ({

            commentsByPost: {

              ...state.commentsByPost,

              [postId]:
                comments,
            },
          })),

        // =========================
        // APPEND
        // =========================
        appendComments: (

          postId,
          comments
        ) =>

          set((state) => {

            const existing =
              state.commentsByPost[
                postId
              ] || [];

            // AVOID DUPLICATES
            const existingIds =
              new Set(

                existing.map(
                  (c) => c.id
                )
              );

            const filtered =
              comments.filter(
                (c) =>
                  !existingIds.has(
                    c.id
                  )
              );

            return {

              commentsByPost: {

                ...state.commentsByPost,

                [postId]: [

                  ...existing,
                  ...filtered,
                ],
              },
            };
          }),

        // =========================
        // PREPEND
        // =========================
        prependComment: (

          postId,
          comment
        ) =>

          set((state) => {

            const existing =
              state.commentsByPost[
                postId
              ] || [];

            // AVOID DUPLICATES
            const alreadyExists =
              existing.some(
                (c) =>
                  c.id ===
                  comment.id
              );

            if (
              alreadyExists
            ) {

              return state;
            }

            return {

              commentsByPost: {

                ...state.commentsByPost,

                [postId]: [

                  comment,
                  ...existing,
                ],
              },
            };
          }),

        // =========================
        // UPDATE
        // =========================
        updateComment: (

          postId,
          commentId,
          updater
        ) =>

          set((state) => {

            const existing =
              state.commentsByPost[
                postId
              ] || [];

            return {

              commentsByPost: {

                ...state.commentsByPost,

                [postId]:

                  existing.map(
                    (comment) =>

                      comment.id ===
                      commentId

                        ? updater(
                            comment
                          )

                        : comment
                  ),
              },
            };
          }),

        // =========================
        // REMOVE
        // =========================
        removeComment: (

          postId,
          commentId
        ) =>

          set((state) => {

            const existing =
              state.commentsByPost[
                postId
              ] || [];

            return {

              commentsByPost: {

                ...state.commentsByPost,

                [postId]:

                  existing.filter(
                    (comment) =>

                      comment.id !==
                      commentId
                  ),
              },
            };
          }),

        // =========================
        // CLEAR
        // =========================
        clearComments: (
          postId
        ) =>

          set((state) => {

            const copy = {
              ...state.commentsByPost,
            };

            delete copy[
              postId
            ];

            return {

              commentsByPost:
                copy,
            };
          }),
      }),

      {

        name:
          'comments-cache',

        storage:
          createJSONStorage(
            () =>
              AsyncStorage
          ),
      }
    )
  );