export type BannerActionType =

  | 'route'
  | 'match'
  | 'external';

export type BannerImage = {

  original: string;

  medium: string;

  thumb: string;
};

export type Banner = {

  id: string;

  title: string;

  subtitle?: string;

  image?: BannerImage;

  buttonText?: string;

  actionType:
    | 'route'
    | 'match'
    | 'external';

  actionValue: string;

  active: boolean;

  order: number;

  createdAt: any;
};