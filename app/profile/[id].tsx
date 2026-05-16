import {
  View,
  FlatList,
} from 'react-native';

import {
  useEffect,
  useState,
} from 'react';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import Header
from '../../components/ui/Header';

import Screen
from '../../components/ui/Screen';

import Container
from '../../components/ui/Container';

import Avatar
from '../../components/ui/Avatar';

import AppButton
from '../../components/ui/AppButton';

import AppText
from '../../components/ui/AppText';

import Loader
from '../../components/ui/Loader';

import EmptyState
from '../../components/ui/EmptyState';

import PostCard
from '../../features/posts/components/PostCard';

import useUserPosts
from '../../features/posts/hooks/useUserPosts';

import useFollowUser
from '../../features/profile/hooks/useFollowUser';

import {
  getUser,
} from '../../services/users/users.service';

import {
  useUserStore,
} from '../../store/useUserStore';

import {
  SPACING,
} from '../../theme';

import {
  User,
} from '../../types/user.types';

export default function UserProfileScreen() {

  const router =
    useRouter();

  const params =
    useLocalSearchParams();

  const id =
    typeof params.id ===
    'string'
      ? params.id
      : '';

  const currentUser =
    useUserStore(
      (state) => state.user
    );

  const [
    user,
    setUser,
  ] = useState<
    User | null
  >(null);

  const [
    loadingUser,
    setLoadingUser,
  ] = useState(true);

  const {
    posts,
  } = useUserPosts(
    id
  );

  const {
    following,
    toggleFollow,
    loading,
  } = useFollowUser(
    currentUser?.id,
    user?.id
  );

  useEffect(() => {

    if (!id) {

      setLoadingUser(false);

      return;
    }

    async function loadUser() {

      try {

        setLoadingUser(true);

        const data =
          await getUser(id);

        setUser(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoadingUser(false);
      }
    }

    loadUser();

  }, [id]);

  if (loadingUser) {

    return (

      <Screen>

        <Header
          title="Perfil"
          onBack={() =>
            router.back()
          }
        />

        <Loader />

      </Screen>
    );
  }

  if (!user) {

    return (

      <Screen>

        <Header
          title="Perfil"
          onBack={() =>
            router.back()
          }
        />

        <Container>

          <EmptyState
            title=
              "Perfil no encontrado"
          />

        </Container>

      </Screen>
    );
  }

  return (

    <Screen>

      <Header
        title="Usuario"

        onBack={() =>
          router.back()
        }
      />

      <FlatList
        data={posts}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={({ item }) => (

          <Container>

            <PostCard
              post={item}
            />

          </Container>
        )}

        showsVerticalScrollIndicator={
          false
        }

        removeClippedSubviews={false}

        keyboardShouldPersistTaps="handled"

        contentContainerStyle={{
          paddingBottom: 140,
        }}

        ListEmptyComponent={

          <Container>

            <EmptyState
              title=
                "Todavía no hay publicaciones."
            />

          </Container>
        }

        ListHeaderComponent={

          <Container>

            <View
              style={{

                alignItems:
                  'center',

                marginTop:
                  SPACING.xl,
              }}
            >

              <Avatar
                uri={
                  user.avatar
                }

                size={120}
              />

              <AppText
                style={{

                  fontSize: 24,

                  fontWeight:
                    'bold',

                  marginTop:
                    SPACING.md,
                }}
              >
                {user.name}
              </AppText>

              {!!user.bio && (

                <AppText
                  style={{

                    marginTop:
                      SPACING.sm,

                    textAlign:
                      'center',
                  }}
                >
                  {user.bio}
                </AppText>

              )}

              {/* STATS */}
              <View
                style={{

                  flexDirection:
                    'row',

                  justifyContent:
                    'space-around',

                  width: '100%',

                  marginTop:
                    SPACING.xl,
                }}
              >

                <View
                  style={{
                    alignItems:
                      'center',
                  }}
                >

                  <AppText
                    style={{

                      fontWeight:
                        'bold',

                      fontSize: 20,
                    }}
                  >
                    {posts.length}
                  </AppText>

                  <AppText>
                    Posts
                  </AppText>

                </View>

                <View
                  style={{
                    alignItems:
                      'center',
                  }}
                >

                  <AppText
                    style={{

                      fontWeight:
                        'bold',

                      fontSize: 20,
                    }}
                  >
                    {
                      user.followersCount ?? 0
                    }
                  </AppText>

                  <AppText>
                    Seguidores
                  </AppText>

                </View>

                <View
                  style={{
                    alignItems:
                      'center',
                  }}
                >

                  <AppText
                    style={{

                      fontWeight:
                        'bold',

                      fontSize: 20,
                    }}
                  >
                    {
                      user.followingCount ?? 0
                    }
                  </AppText>

                  <AppText>
                    Siguiendo
                  </AppText>

                </View>

              </View>

              {/* ACTION BUTTON */}
              {currentUser?.id !==
                user.id && (

                <View
                  style={{

                    width: '100%',

                    marginTop:
                      SPACING.xl,
                  }}
                >

                  <AppButton
                    title={
                      loading
                        ? 'Cargando...'
                        : following
                          ? 'Siguiendo'
                          : 'Seguir'
                    }

                    disabled={
                      loading
                    }

                    onPress={
                      toggleFollow
                    }
                  />

                </View>
              )}

            </View>

          </Container>
        }
      />

    </Screen>
  );
}