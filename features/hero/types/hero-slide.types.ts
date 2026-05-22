export type HeroActionType =

  | 'route'
  | 'match'
  | 'external';

export type HeroSlide = {

  id: string;

  title: string;

  image: string;

  description?: string;

  buttonText?: string;

  actionType: HeroActionType;

  actionValue: string;
};