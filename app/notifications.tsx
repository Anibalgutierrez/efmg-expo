import {
  useEffect,
  useCallback,
} from 'react';

import {
  FlatList,
  View,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import Screen
from '../components/ui/Screen';

import Header
from '../components/ui/Header';

import Container
from '../components/ui/Container';

import AppText
from '../components/ui/AppText';

import NotificationCard
from '../features/notifications/components/NotificationCard';

import useNotifications
from '../features/notifications/hooks/useNotifications';

import {
  useUserStore,
} from '../store/useUserStore';

import {
  markNotificationsAsRead,
} from '../services/notifications/notifications.service';

import {
  SPACING,
} from '../theme';

export default function NotificationsScreen() {

  const router =
    useRouter();

  const user =
    useUserStore(
      (state) => state.user
    );

  const {
    notifications,
  } = useNotifications(
    user?.id
  );

  // =========================
  // MARK AS READ
  // =========================
  useEffect(() => {

    if (!user?.id) {
      return;
    }

    markNotificationsAsRead(
      user.id
    );

  }, [
    user?.id,
  ]);

  // =========================
  // RENDER ITEM
  // =========================
  const renderItem =
    useCallback(
      ({ item }: any) => (

        <Container>

          <NotificationCard
            notification={
              item
            }
          />

        </Container>

      ),
      []
    );

  // =========================
  // EMPTY
  // =========================
  const renderEmpty =
    useCallback(
      () => (

        <Container>

          <View
            style={{
              paddingTop: 120,
              alignItems:
                'center',
            }}
          >

            <AppText
              style={{
                opacity: 0.7,
              }}
            >
              No hay notificaciones
            </AppText>

          </View>

        </Container>

      ),
      []
    );

  return (

    <Screen>

      <Header
        title="Notificaciones"

        onBack={() =>
          router.back()
        }
      />

      <FlatList
        data={notifications}

        renderItem={
          renderItem
        }

        keyExtractor={(item) =>
          item.id
        }

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingTop:
            SPACING.md,

          paddingBottom: 120,

          flexGrow: 1,
        }}

        ListEmptyComponent={
          renderEmpty
        }
      />

    </Screen>
  );
}