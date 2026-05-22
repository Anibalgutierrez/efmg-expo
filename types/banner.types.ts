import {
  Timestamp,
} from 'firebase/firestore';

export type BannerActionType =

  | 'route'
  | 'match'
  | 'external';

export type Banner = {

  id: string;

  title: string;

  subtitle: string;

  image: string;

  active: boolean;

  order: number;

  createdAt: Timestamp;

  buttonText?: string;

  actionType?:
    BannerActionType;

  actionValue?: string;
};