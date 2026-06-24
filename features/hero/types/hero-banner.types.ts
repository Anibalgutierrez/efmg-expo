export type HeroBanner = {

  id: string;

  title: string;

  subtitle: string;

  image: any;

  buttonText?: string;

  actionType:
    | 'route'
    | 'url';

  actionValue: string;
};