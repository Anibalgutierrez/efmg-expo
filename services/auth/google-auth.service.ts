import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import {
  auth,
} from '../../firebase/config';

export async function signInWithGoogle() {

  const provider =
    new GoogleAuthProvider();

  const result =
    await signInWithPopup(
      auth,
      provider
    );

  return result.user;
}