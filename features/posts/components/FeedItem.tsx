import {
  memo,
} from 'react';

import PostCard
  from './PostCard';

import ReelCard
  from './ReelCard';

import {
  Post,
} from '../../../types/post.types';

type Props = {
  post: Post;
};

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

      prev.post.id ===
        next.post.id &&

      prev.post.likesCount ===
        next.post.likesCount &&

      prev.post.commentsCount ===
        next.post.commentsCount &&

      prev.post.content ===
        next.post.content &&

      prev.post.image ===
        next.post.image &&

      prev.post.thumbnail ===
        next.post.thumbnail &&

      prev.post.reelUrl ===
        next.post.reelUrl &&

      prev.post.createdAt ===
        next.post.createdAt
    );
  }
);