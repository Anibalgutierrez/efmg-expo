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

import useTabBar
from '../../context/TabBarContext';

export default function TabsLayout() {

  const {
    COLORS,
  } = useTheme();

  const {
    visible,
  } = useTabBar();

  const user =
    useUserStore(
      (state) => state.user
    );

  const {
    unreadCount,
  } = useNotifications(
    user?.id
  );

  const canCreatePost =
    user?.role === 'admin' ||
    user?.role === 'influencer';

  return (

    <Tabs
      screenOptions={{

        headerShown: false,

        tabBarStyle: {

          backgroundColor:
            COLORS.surface,

          borderTopColor:
            COLORS.border,

          height:
            visible
              ? 70
              : 0,

          paddingBottom:
            visible
              ? 10
              : 0,

          overflow:
            'hidden',

          display:
            visible
              ? 'flex'
              : 'none',
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

{/* CREATE */}
<Tabs.Screen
  name="create"

  options={{

    href:
      canCreatePost
        ? '/create'
        : null,

    title: 'Crear',

    tabBarIcon: ({
      color,
      size,
    }) => (

      <Ionicons
        name="add"
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