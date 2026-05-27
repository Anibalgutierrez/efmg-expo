import { User }
from '../../../types/user.types';

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

export type PostImage = {

  original: string;

  medium: string;

  thumb: string;
};

export type Post = {

  id: string;

  type: PostType;

  content: string;

  images?: PostImage[];

  reelUrl?: string;

  thumbnail?: string;

  platform?: ReelPlatform;

  createdAt: Timestamp;

  likesCount: number;

  commentsCount: number;

  user: User;
};