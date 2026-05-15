import {
  useEffect,
} from 'react';

import {
  onAuthStateChanged,
} from 'firebase/auth';

import {
  auth,
} from '../firebase/config';

import {
  getUser,
} from '../services/users/users.service';

import {
  useUserStore,
} from '../store/useUserStore';

export default function useAuthListener() {

  const setUser =
    useUserStore(
      (state) => state.setUser
    );

  const clearUser =
    useUserStore(
      (state) => state.clearUser
    );

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          firebaseUser
        ) => {

          if (
            !firebaseUser
          ) {

            clearUser();

            return;
          }

          const user =
            await getUser(
              firebaseUser.uid
            );

          if (user) {
            setUser(user);
          }
        }
      );

    return unsubscribe;

  }, []);
}