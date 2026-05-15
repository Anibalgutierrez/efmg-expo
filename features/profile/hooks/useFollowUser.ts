import {
  useEffect,
  useState,
} from 'react';

import {
  followUser,
  unfollowUser,
  subscribeToFollowStatus,
} from '../../../services/users/follow.service';

import {
  createNotification,
} from '../../../services/notifications/notifications.service';

import {
  useUserStore,
} from '../../../store/useUserStore';

export default function useFollowUser(

  currentUserId?: string,
  targetUserId?: string

) {

  const currentUser =
    useUserStore(
      (state) => state.user
    );

  const [
    following,
    setFollowing,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {

    if (
      !currentUserId ||
      !targetUserId
    ) {
      return;
    }

    const unsubscribe =
      subscribeToFollowStatus(

        currentUserId,
        targetUserId,

        setFollowing
      );

    return unsubscribe;

  }, [
    currentUserId,
    targetUserId,
  ]);

  async function toggleFollow() {

    if (
      !currentUserId ||
      !targetUserId
    ) {
      return;
    }

    if (loading) {
      return;
    }

    try {

      setLoading(true);

      if (following) {

        await unfollowUser(

          currentUserId,
          targetUserId
        );

      } else {

        await followUser(

          currentUserId,
          targetUserId
        );

        if (
          currentUserId !==
          targetUserId
        ) {

          await createNotification({

            receiverId:
              targetUserId,

            type: 'follow',

            senderId:
              currentUserId,

            senderName:
              currentUser?.name ||
              'Usuario',

            senderAvatar:
              currentUser?.avatar ||
              '',

            text:
              'comenzó a seguirte',
          });
        }
      }

    } catch (error) {

      console.log(
        'Follow error:',
        error
      );

    } finally {

      setLoading(false);
    }
  }

  return {

    following,

    loading,

    toggleFollow,
  };
}