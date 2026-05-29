import {
  memo,
} from 'react';

import PostCard
  from './PostCard';

import ReelCard
  from './ReelCard';

import {
  Post,
  PostImage,
} from '../types/post.types';

type Props = {
  post: Post;
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
      next.images,
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

function FeedItem({
  post,
}: Props) {

  // =========================
  // REEL
  // =========================
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

  // =========================
  // NORMAL POST
  // =========================
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

    return arePostsEqual(
      prev.post,
      next.post
    );
  }
);