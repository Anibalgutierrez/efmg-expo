import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import {
  increment,
  doc,
  onSnapshot,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  createNotification,
} from '../../../services/notifications/notifications.service';

import {
  useUserStore,
} from '../../../store/useUserStore';

import {
  usePostsStore,
} from '../store/usePostsStore';

export default function useLikePost(
  postId: string,

  initialLikes: number = 0,

  userId?: string,

  postOwnerId?: string
) {

  // =========================
  // STORES
  // =========================
  const currentUser =
    useUserStore(
      (state) => state.user
    );

  const updateLikes =
    usePostsStore(
      (state) =>
        state.updateLikes
    );

  // =========================
  // LOCAL STATE
  // =========================
  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(initialLikes);

  // =========================
  // SYNC INITIAL LIKES
  // =========================
  useEffect(() => {

    setLikes(
      initialLikes
    );

  }, [
    initialLikes,
  ]);

  // =========================
  // REFS
  // =========================
  const processingRef =
    useRef(false);

  // =========================
  // REALTIME LIKE STATUS
  // =========================
  useEffect(() => {

    if (!userId) {
      return;
    }

    const likeRef = doc(
      db,
      'posts',
      postId,
      'likes',
      userId
    );

    const unsubscribe =
      onSnapshot(
        likeRef,
        (snapshot) => {

          setLiked(
            snapshot.exists()
          );
        }
      );

    return unsubscribe;

  }, [
    postId,
    userId,
  ]);

  // =========================
  // TOGGLE LIKE
  // =========================
  const toggleLike =
    useCallback(async () => {

      if (
        !userId ||
        processingRef.current
      ) {
        return;
      }

      processingRef.current =
        true;

      const previousLiked =
        liked;

      const previousLikes =
        likes;

      const nextLiked =
        !previousLiked;

      const nextLikes =
        nextLiked

          ? previousLikes + 1

          : Math.max(
              0,
              previousLikes - 1
            );

      // =========================
      // OPTIMISTIC UI
      // =========================
      setLiked(
        nextLiked
      );

      setLikes(
        nextLikes
      );

      updateLikes(
        postId,
        nextLikes
      );

      try {

        const postRef = doc(
          db,
          'posts',
          postId
        );

        const likeRef = doc(
          db,
          'posts',
          postId,
          'likes',
          userId
        );

        // =========================
        // FIREBASE TRANSACTION
        // =========================
        await runTransaction(
          db,

          async (
            transaction
          ) => {

            const likeSnap =
              await transaction.get(
                likeRef
              );

            const alreadyLiked =
              likeSnap.exists();

            // =========================
            // REMOVE LIKE
            // =========================
            if (
              alreadyLiked
            ) {

              transaction.delete(
                likeRef
              );

              transaction.update(
                postRef,
                {
                  likesCount:
                    increment(-1),
                }
              );

              return;
            }

            // =========================
            // ADD LIKE
            // =========================
            transaction.set(
              likeRef,
              {
                createdAt:
                  serverTimestamp(),
              }
            );

            transaction.update(
              postRef,
              {
                likesCount:
                  increment(1),
              }
            );
          }
        );

        // =========================
        // NOTIFICATION
        // =========================
        if (
          nextLiked &&
          postOwnerId &&
          postOwnerId !==
            currentUser?.id
        ) {

          createNotification({

            receiverId:
              postOwnerId,

            type:
              'like',

            senderId:
              currentUser?.id || '',

            senderName:
              currentUser?.name ||
              'Usuario',

            senderAvatar:
              currentUser?.avatar ||
              '',

            postId,

            text:
              'le dio like a tu publicación',
          }).catch(
            console.log
          );
        }

      } catch (error) {

        console.log(
          'LIKE ERROR:',
          error
        );

        // =========================
        // ROLLBACK
        // =========================
        setLiked(
          previousLiked
        );

        setLikes(
          previousLikes
        );

        updateLikes(
          postId,
          previousLikes
        );

      } finally {

        processingRef.current =
          false;
      }

    }, [

      liked,

      likes,

      postId,

      postOwnerId,

      currentUser?.id,

      currentUser?.name,

      currentUser?.avatar,

      updateLikes,

      userId,
    ]);

  return {

    liked,

    likes,

    toggleLike,
  };
}