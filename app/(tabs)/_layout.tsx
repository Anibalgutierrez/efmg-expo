import {
  Tabs,
} from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';

import useTheme
from '../../hooks/useTheme';

import useNotifications
from '../../features/notifications/hooks/useNotifications';

import {
  useUserStore,
} from '../../store/useUserStore';

export default function TabsLayout() {

  const {
    COLORS,
  } = useTheme();

  const user =
    useUserStore(
      (state) => state.user
    );

  const {
    unreadCount,
  } = useNotifications(
    user?.id
  );

  return (

    <Tabs
      screenOptions={{

        headerShown: false,

        tabBarStyle: {

          backgroundColor:
            COLORS.surface,

          borderTopColor:
            COLORS.border,

          height: 70,

          paddingBottom: 10,
        },

        tabBarActiveTintColor:
          COLORS.primary,

        tabBarInactiveTintColor:
          COLORS.textSecondary,
      }}
    >

      {/* HOME */}
      <Tabs.Screen
        name="index"

        options={{

          title: 'Inicio',

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* REELS */}
      <Tabs.Screen
        name="reels"

        options={{

          title: 'Reels',

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="play-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* MATCHES */}
      <Tabs.Screen
        name="matches"

        options={{

          title: 'Partidos',

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="football"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* NOTIFICATIONS */}
      <Tabs.Screen
        name="notifications"

        options={{

          title:
            'Notificaciones',

          tabBarBadge:
            unreadCount > 0
              ? unreadCount
              : undefined,

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="notifications"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"

        options={{

          title: 'Perfil',

          tabBarIcon: ({
            color,
            size,
          }) => (

            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  );
}