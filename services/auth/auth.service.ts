import {
  signInAnonymously,
} from 'firebase/auth';

import { auth } from '../../firebase/config';

export async function loginAnonymously() {
  const result =
    await signInAnonymously(auth);

  return result.user;
}