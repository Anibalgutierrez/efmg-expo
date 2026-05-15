import { User }
from './user.types';

import {
  Timestamp,
} from 'firebase/firestore';

export type PostType =
  | 'post'
  | 'reel';

export type ReelPlatform =
  | 'youtube'
  | 'tiktok'
  | 'instagram';

export type Post = {

  id: string;

  type: PostType;

  content: string;

  image?: string;

  // REELS
  reelUrl?: string;

  thumbnail?: string;

  platform?: ReelPlatform;

  createdAt: Timestamp;

  likesCount: number;

  commentsCount: number;

  user: User;
};