import {
  memo,
} from 'react';

import PostCard
  from './PostCard';

import ReelCard
  from './ReelCard';

import {
  Post,
} from '../types/post.types';

type Props = {
  post: Post;
};

// =========================
// IMAGE COMPARE
// =========================
function areImagesEqual(
  prevImages?: any[],
  nextImages?: any[],
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

function FeedItem({
  post,
}: Props) {

  if (
    post.type ===
    'reel'
  ) {

    return (
      <ReelCard
        post={post}
      />
    );
  }

  return (
    <PostCard
      post={post}
    />
  );
}

export default memo(
  FeedItem,

  (
    prev,
    next
  ) => {

    return (

      // BASIC
      prev.post.id ===
        next.post.id &&

      prev.post.type ===
        next.post.type &&

      prev.post.content ===
        next.post.content &&

      // COUNTS
      prev.post.likesCount ===
        next.post.likesCount &&

      prev.post.commentsCount ===
        next.post.commentsCount &&

      // MEDIA
      prev.post.thumbnail ===
        next.post.thumbnail &&

      prev.post.reelUrl ===
        next.post.reelUrl &&

      areImagesEqual(
        prev.post.images,
        next.post.images,
      ) &&

      // USER
      prev.post.user.id ===
        next.post.user.id &&

      prev.post.user.name ===
        next.post.user.name &&

      // DATE
      prev.post.createdAt?.seconds ===
        next.post.createdAt?.seconds
    );
  }
);