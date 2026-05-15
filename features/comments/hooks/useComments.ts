import {
  useEffect,
  useState,
} from 'react';

import {
  subscribeToComments,
} from '../../../services/posts/comments.service';

import { Comment }
from '../../../types/comment.types';

export default function useComments(
  postId: string
) {
  const [comments, setComments] =
    useState<Comment[]>([])

  useEffect(() => {
    const unsubscribe =
      subscribeToComments(
        postId,
        setComments
      );

    return unsubscribe;
  }, [postId]);

  return {
    comments,
  };
}