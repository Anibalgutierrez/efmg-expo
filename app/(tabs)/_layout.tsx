import {
  Tabs,
} from 'expo-router';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


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

        lazy: true,
        freezeOnBlur: true,

        headerShown: false,

        tabBarStyle: {

          backgroundColor:
            COLORS.surface,

          borderTopColor:
            COLORS.border,

          position: 'absolute',

          height: 70,

          paddingBottom: 10,

          transform: [
            {
              translateY:
                visible ? 0 : 100,
            },
          ],

          opacity:
            visible ? 1 : 0,
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

      {/* MATCHES */}
      <Tabs.Screen
        name="matches/index"

        options={{

          title: 'Partidos',

          headerShown: false,

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

      {/* PREDIO */}
      <Tabs.Screen
        name="predio"

        options={{

          title: 'Predio',

          tabBarIcon: ({
            color,
            size,
          }) => (

            <MaterialCommunityIcons
              name="soccer-field"
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