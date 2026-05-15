import { User }
from './user.types';

import {
  Timestamp,
} from 'firebase/firestore';

export type Comment = {
  id: string;

  text: string;

  createdAt: any;

  user: User;
};