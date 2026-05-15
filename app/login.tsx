import {
  View,
} from 'react-native';

import {
  router,
} from 'expo-router';

import Screen
from '../components/ui/Screen';

import Container
from '../components/ui/Container';

import AppButton
from '../components/ui/AppButton';

import AppText
from '../components/ui/AppText';

import {
  SPACING,
} from '../theme';

import {
  signInWithGoogle,
} from '../services/auth/google-auth.service';

import {
  createUser,
} from '../services/users/users.service';

import {
  useUserStore,
} from '../store/useUserStore';

import {
  User,
} from '../types/user.types';

export default function LoginScreen() {

  const setUser =
    useUserStore(
      (state) => state.setUser
    );

  const setLoading =
    useUserStore(
      (state) => state.setLoading
    );

  async function handleGoogleLogin() {

    try {

      setLoading(true);

      const firebaseUser =
        await signInWithGoogle();

      if (!firebaseUser) {

        setLoading(false);

        return;
      }

      const userData: User = {

        id:
          firebaseUser.uid,

        name:
          firebaseUser.displayName ||
          'EFMG User',

        avatar:
          firebaseUser.photoURL ||
          '',

        bio: '',

        followersCount: 0,

        followingCount: 0,

        postsCount: 0,

        role: 'user',
      };

      await createUser(
        firebaseUser.uid,
        userData
      );

      setUser(userData);

      setLoading(false);

      router.replace(
        '/(tabs)'
      );

    } catch (error) {

      setLoading(false);

      console.log(
        'Google login error:',
        error
      );
    }
  }

  return (
    <Screen>

      <Container>

        <View
          style={{
            flex: 1,

            justifyContent:
              'center',

            alignItems:
              'center',
          }}
        >

          <AppText
            style={{
              fontSize: 32,

              fontWeight:
                'bold',

              marginBottom:
                SPACING.xl,
            }}
          >
            EFMG Social
          </AppText>

          <AppButton
            title=
              "Continuar con Google"

            onPress={
              handleGoogleLogin
            }
          />

        </View>

      </Container>

    </Screen>
  );
}