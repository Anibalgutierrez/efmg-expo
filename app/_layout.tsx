import {
  Stack,
  Redirect,
  usePathname,
} from 'expo-router';

import {
  useEffect,
} from 'react';

import * as SplashScreen
from 'expo-splash-screen';

import LoaderFullScreen
from '@/components/ui/LoaderFullScreen';

import {
  useUserStore,
} from '../store/useUserStore';

import {
  initAuthListener,
} from '../services/auth/auth-listener.service';

import {
  TabBarProvider,
} from '../context/TabBarContext';

// =========================
// KEEP SPLASH
// =========================
SplashScreen.preventAutoHideAsync();

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

  // =========================
  // INIT AUTH
  // =========================
  useEffect(() => {

    initAuthListener();

  }, []);

  // =========================
  // HIDE SPLASH
  // =========================
  useEffect(() => {

    if (!loading) {

      SplashScreen.hideAsync();
    }

  }, [loading]);

  // =========================
  // GLOBAL LOADING
  // =========================
  if (loading) {

    return (
      <LoaderFullScreen />
    );
  }

  const isAuthRoute =
    pathname === '/login';

  // =========================
  // REDIRECT TO LOGIN
  // =========================
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

  // =========================
  // REDIRECT TO APP
  // =========================
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