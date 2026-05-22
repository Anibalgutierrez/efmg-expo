import * as Linking
from 'expo-linking';

import {
  Router,
} from 'expo-router';

import {
  HeroSlide,
} from '../types/hero-slide.types';

export async function handleHeroAction(

  slide: HeroSlide,

  router: Router,
) {

  switch (
    slide.actionType
  ) {

    case 'route':

      router.push(
        slide.actionValue as never
      );

      break;

    case 'match':

      router.push(
        `/match/${slide.actionValue}` as never
      );

      break;

    case 'external':

      await Linking.openURL(
        slide.actionValue
      );

      break;

    default:

      console.log(
        'Unknown hero action:',
        slide.actionType,
      );
  }
}