import {
  Timestamp,
} from 'firebase/firestore';

import {
  User,
} from './user.types';

export type Story = {
  id: string;

  user: User;

  image: string;

  createdAt: Timestamp;

  expiresAt: Timestamp;
};