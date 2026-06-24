import {
  View,
  FlatList,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import {
  signOut,
} from 'firebase/auth';

import {
  auth,
} from '../../firebase/config';

import {
  useUserStore,
} from '../../store/useUserStore';

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

import EmptyState
from '../../components/ui/EmptyState';

import PostCard
from '../../features/posts/components/PostCard';

import useUserPosts
from '../../features/posts/hooks/useUserPosts';

import {
  SPACING,
} from '../../theme';

export default function ProfileScreen() {

  const router =
    useRouter();

  const user =
    useUserStore(
      (state) => state.user
    );

  const clearUser =
    useUserStore(
      (state) => state.clearUser
    );

  const {
    posts,
  } = useUserPosts(
    user?.id || ''
  );

  async function handleLogout() {

    await signOut(auth);

    clearUser();

    router.replace(
      '/login'
    );
  }

  if (!user) {

    return (

      <Screen>

        <Container>

          <EmptyState
            title=
              "No hay usuario logueado."
          />

        </Container>

      </Screen>
    );
  }

  console.log(
  'PROFILE POSTS',
  posts.map(post => ({
    id: post.id,
    avatar: post.user.avatar,
  }))
);

  return (

    <Screen>

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
                      user.followersCount || 0
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
                      user.followingCount || 0
                    }
                  </AppText>

                  <AppText>
                    Siguiendo
                  </AppText>

                </View>

              </View>

              {/* ACTIONS */}
              <View
                style={{

                  width: '100%',

                  marginTop:
                    SPACING.xl,

                  gap: 12,
                }}
              >

                <AppButton
                  title=
                    "Editar Perfil"

                  onPress={() =>
                    router.push(
                      '/edit-profile'
                    )
                  }
                />

                <AppButton
                  title=
                    "Cerrar Sesión"

                  onPress={
                    handleLogout
                  }
                />

              </View>

            </View>

          </Container>
        }
      />

    </Screen>
  );
}