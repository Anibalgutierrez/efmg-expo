import * as Linking
from 'expo-linking';

import {
  Router,
} from 'expo-router';

import {
  Banner,
} from '../types/banner.types';

export async function handleBannerAction(

  banner: Banner,

  router: Router,
) {

  if (
    !banner.actionType ||
    !banner.actionValue
  ) {
    return;
  }

  switch (
    banner.actionType
  ) {

    case 'route':

      router.push(
        banner.actionValue as never
      );

      break;

    case 'match':

      router.push(
        `/match/${banner.actionValue}` as never
      );

      break;

    case 'external':

      await Linking.openURL(
        banner.actionValue
      );

      break;

    default:

      console.log(
        'Unknown banner action:',
        banner.actionType,
      );
  }
}