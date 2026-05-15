import {
  Timestamp,
} from 'firebase/firestore';

export type Banner = {
  id: string;

  title: string;

  subtitle: string;

  image: string;

  active: boolean;

  order: number;

  createdAt: Timestamp;
};