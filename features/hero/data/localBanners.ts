import {
  HeroBanner,
} from '../types/hero-banner.types';

export const LOCAL_BANNERS:
HeroBanner[] = [

  {
    id: 'banner-1',

    title:
      'Escuela EFMG',

    subtitle:
      'Formación de futbolistas',

    image:
      require(
        '../../../assets/banners/SuperCampeonas.png'
      ),

    buttonText:
      'Ver más',

    actionType:
      'route',

    actionValue:
      '/about',
  },

 

];