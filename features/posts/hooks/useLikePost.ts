import {
  useState,
  useEffect,
} from 'react';

import {
  increment,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
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

export default function useLikePost(
  postId: string,

  initialLikes: number = 0,

  userId?: string,

  postOwnerId?: string
) {

  const currentUser =
    useUserStore(
      (state) => state.user
    );

  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(initialLikes);

  useEffect(() => {

    if (!userId) return;

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

  }, [postId, userId]);

  async function toggleLike() {

    try {

      if (!userId) return;

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

      if (liked) {

        await deleteDoc(
          likeRef
        );

        await updateDoc(
          postRef,
          {
            likesCount:
              increment(-1),
          }
        );

        setLikes(
          (prev) => prev - 1
        );

      } else {

        await setDoc(
          likeRef,
          {
            createdAt:
              serverTimestamp(),
          }
        );

        await updateDoc(
          postRef,
          {
            likesCount:
              increment(1),
          }
        );

        setLikes(
          (prev) => prev + 1
        );

        // NOTIFICATION
        if (
          postOwnerId &&
          postOwnerId !==
            currentUser?.id
        ) {

          await createNotification({

  receiverId:
    postOwnerId,

  type: 'like',

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
});
        }
      }

      setLiked(
        (prev) => !prev
      );

    } catch (error) {

      console.log(
        'Error toggling like:',
        error
      );
    }
  }

  return {
    liked,
    likes,
    toggleLike,
  };
}