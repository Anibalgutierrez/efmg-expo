import {
  useEffect,
} from 'react';


import {
  FlatList,
} from 'react-native';

import Screen
from '../components/ui/Screen';

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

export default function NotificationsScreen() {

  const user =
    useUserStore(
      (state) => state.user
    );

  const {
    notifications,
  } = useNotifications(
    user?.id
  );


  useEffect(() => {

  if (!user?.id) return;

  markNotificationsAsRead(
    user.id
  );

}, []);



  return (
    <Screen>

      <FlatList
        data={notifications}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={({ item }) => (
          <Container>

            <NotificationCard
              notification={
                item
              }
            />

          </Container>
        )}

        ListEmptyComponent={
          <Container>

            <AppText>
              No hay notificaciones
            </AppText>

          </Container>
        }
      />

    </Screen>
  );
}