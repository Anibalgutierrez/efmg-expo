import {
  useState,
} from 'react';

import {
  View,
  TextInput,
  Alert,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import {
  Image,
} from 'expo-image';

import Screen from '../components/ui/Screen';

import Header from '../components/ui/Header';

import Container from '../components/ui/Container';

import AppButton from '../components/ui/AppButton';

import AppText from '../components/ui/AppText';

import {
  SPACING,
  RADIUS,
} from '../theme';

import useTheme from '../hooks/useTheme';

import useImagePicker from '../hooks/useImagePicker';

import {
  uploadImage,
} from '../services/storage/storage.service';

import {
  updateUser,
} from '../services/users/update-user.service';

import {
  syncUserData,
} from '../services/users/sync-user-data.service';

import {
  useUserStore,
} from '../store/useUserStore';

import {
  usePostsStore,
} from '../features/posts/store/usePostsStore';

export default function EditProfileScreen() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const user =
    useUserStore(
      (state) => state.user
    );

  const setUser =
    useUserStore(
      (state) => state.setUser
    );

  const updateUserPosts =
    usePostsStore(
      (state) =>
        state.updateUserPosts
    );

  const {
    pickImage,
  } = useImagePicker();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    avatar,
    setAvatar,
  ] = useState<string>(
    user?.avatar || ''
  );

  const [
    name,
    setName,
  ] = useState(
    user?.name || ''
  );

  const [
    bio,
    setBio,
  ] = useState(
    user?.bio || ''
  );

  // =========================
  // PICK AVATAR
  // =========================
  async function handlePickAvatar() {

    const images =
      await pickImage({

        multiple: false,
      });

    if (
      !images ||
      images.length === 0
    ) {
      return;
    }

    const image =
      images[0];

    setAvatar(
      image.uri
    );

  }

  // =========================
  // SAVE
  // =========================
  async function handleSave() {

    if (!user) {
      return;
    }

    try {

      setLoading(true);

      let avatarUrl =
        user.avatar || '';

      // =========================
      // UPLOAD NEW AVATAR
      // =========================
      if (

        avatar &&

        avatar !== user.avatar

      ) {

        const uploadedAvatar =
          await uploadImage(

            avatar,

            'avatars'
          );

        avatarUrl =
          uploadedAvatar.original;
      }

      const updatedUser = {

        ...user,

        name,
        bio,

        avatar:
          avatarUrl,
      };

      // =========================
      // UPDATE USER DOC
      // =========================
      await updateUser({

        userId:
          user.id,

        data: {

          name,
          bio,

          avatar:
            avatarUrl,
        },
      });

      // =========================
      // UPDATE LOCAL STORES
      // =========================
      setUser(
        updatedUser
      );

      updateUserPosts(
        user.id,
        {
          name,
          bio,

          avatar:
            avatarUrl,
        }
      );

      console.log(
  'NEW AVATAR:',
  avatarUrl
);

      // =========================
      // SYNC FIRESTORE POSTS
      // =========================
      await syncUserData(
        user.id,
        {
          name,
          bio,
          avatar: avatarUrl,
        }
      );

      Alert.alert(
        'Perfil actualizado'
      );

      router.back();

    } catch (error) {

      console.log(
        'EDIT PROFILE ERROR:',
        error
      );

      Alert.alert(

        'Error',

        'No se pudo actualizar el perfil'
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <Screen>

      <Header
        title="Editar Perfil"

        onBack={() =>
          router.back()
        }
      />

      <Container>

        <View
          style={{

            alignItems:
              'center',

            marginTop:
              SPACING.xl,
          }}
        >

          {avatar ? (

            <Image
              source={{
                uri: avatar,
              }}

              contentFit="cover"

              style={{

                width: 120,
                height: 120,

                borderRadius: 60,

                marginBottom:
                  SPACING.md,

                borderWidth: 3,

                borderColor:
                  COLORS.primary,
              }}
            />

          ) : (

            <View
              style={{

                width: 120,
                height: 120,

                borderRadius: 60,

                backgroundColor:
                  COLORS.surface,

                justifyContent:
                  'center',

                alignItems:
                  'center',

                marginBottom:
                  SPACING.md,
              }}
            >

              <AppText
                style={{
                  color:
                    COLORS.textSecondary,
                }}
              >
                Sin avatar
              </AppText>

            </View>

          )}

          <AppButton
            title="Seleccionar Avatar"

            onPress={
              handlePickAvatar
            }
          />

        </View>

        <View
          style={{
            marginTop:
              SPACING.xl,
          }}
        >

          <AppText
            style={{

              marginBottom: 8,

              fontWeight:
                '600',

              color:
                COLORS.text,
            }}
          >
            Nombre
          </AppText>

          <TextInput
            placeholder="Nombre"

            placeholderTextColor={
              COLORS.textSecondary
            }

            value={name}

            onChangeText={
              setName
            }

            style={{

              backgroundColor:
                COLORS.surface,

              borderRadius:
                RADIUS.lg,

              padding:
                SPACING.md,

              color:
                COLORS.text,

              borderWidth: 1,

              borderColor:
                COLORS.border,
            }}
          />

        </View>

        <View
          style={{
            marginTop:
              SPACING.lg,
          }}
        >

          <AppText
            style={{

              marginBottom: 8,

              fontWeight:
                '600',

              color:
                COLORS.text,
            }}
          >
            Bio
          </AppText>

          <TextInput
            placeholder="Cuéntanos algo sobre ti..."

            placeholderTextColor={
              COLORS.textSecondary
            }

            value={bio}

            onChangeText={
              setBio
            }

            multiline

            style={{

              backgroundColor:
                COLORS.surface,

              borderRadius:
                RADIUS.lg,

              padding:
                SPACING.md,

              color:
                COLORS.text,

              borderWidth: 1,

              borderColor:
                COLORS.border,

              minHeight: 120,

              textAlignVertical:
                'top',
            }}
          />

        </View>

        <View
          style={{
            marginTop:
              SPACING.xl,
          }}
        >

          <AppButton
            title={
              loading
                ? 'Guardando...'
                : 'Guardar Perfil'
            }

            loading={
              loading
            }

            onPress={
              handleSave
            }
          />

        </View>

      </Container>

    </Screen>

  );
}
