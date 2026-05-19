export type User = {
  id: string;

  name: string;

  avatar?: string;

  bio?: string;

  followersCount: number;

  followingCount: number;

  postsCount: number;

  role: 'admin' | 'user' | 'influencer' | 'collaborator';
};