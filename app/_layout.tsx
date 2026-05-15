import {
  Stack,
  Redirect,
  usePathname,
} from 'expo-router';

import {
  useEffect,
} from 'react';

import Loader
from '../components/ui/Loader';

import {
  useUserStore,
} from '../store/useUserStore';

import {
  initAuthListener,
} from '../services/auth/auth-listener.service';

import {
  TabBarProvider,
} from '../context/TabBarContext';

export default function RootLayout() {

  const user =
    useUserStore(
      (state) => state.user
    );

  const loading =
    useUserStore(
      (state) => state.loading
    );

  const pathname =
    usePathname();

  useEffect(() => {

    initAuthListener();

  }, []);

  if (loading) {
    return <Loader />;
  }

  const isAuthRoute =
    pathname === '/login';

  if (
    !user &&
    !isAuthRoute
  ) {

    return (
      <Redirect
        href="/login"
      />
    );
  }

  if (
    user &&
    isAuthRoute
  ) {

    return (
      <Redirect
        href="/(tabs)"
      />
    );
  }

  return (

    <TabBarProvider>

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

    </TabBarProvider>
  );
}