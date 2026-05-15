import {
  onAuthStateChanged,
} from 'firebase/auth';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  auth,
  db,
} from '../../firebase/config';

import {
  useUserStore,
} from '../../store/useUserStore';

export function initAuthListener() {

  const setUser =
    useUserStore.getState()
      .setUser;

  const setLoading =
    useUserStore.getState()
      .setLoading;

  onAuthStateChanged(
    auth,

    async (firebaseUser) => {

      try {

        if (!firebaseUser) {

          setUser(null);

          setLoading(false);

          return;
        }

        const userRef =
          doc(
            db,
            'users',
            firebaseUser.uid
          );

        const snapshot =
          await getDoc(
            userRef
          );

        if (
          snapshot.exists()
        ) {

          setUser(
            snapshot.data() as any
          );
        }

      } catch (error) {

        console.log(
          'Auth listener error:',
          error
        );

      } finally {

        setLoading(false);
      }
    }
  );
}