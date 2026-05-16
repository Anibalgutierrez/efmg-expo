import {
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import {
  useState,
  useCallback,
  useMemo,
} from 'react';

import {
  Image,
} from 'expo-image';

import {
  useRouter,
} from 'expo-router';

import {
  serverTimestamp,
} from 'firebase/firestore';

import AppButton
from '../../components/ui/AppButton';

import AppText
from '../../components/ui/AppText';

import Screen
from '../../components/ui/Screen';

import Header
from '../../components/ui/Header';

import {
  SPACING,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

import useImagePicker, {
  PickedImage,
} from '../../hooks/useImagePicker';

import {
  createPost,
} from '../../services/posts/posts.service';

import {
  uploadImage,
} from '../../services/storage/storage.service';

import {
  useUserStore,
} from '../../store/useUserStore';

import {
  PostType,
} from '../../types/post.types';

export default function CreateScreen() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const user =
    useUserStore(
      (state) => state.user
    );

  const {
    pickImage,
  } = useImagePicker();

  // =========================
  // STATE
  // =========================
  const [
    type,
    setType,
  ] = useState<PostType>(
    'post'
  );

  const [
    content,
    setContent,
  ] = useState('');

  const [
    imageUri,
    setImageUri,
  ] = useState<
    string | undefined
  >();

  const [
    reelUrl,
    setReelUrl,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  // =========================
  // RESET
  // =========================
  const resetForm =
    useCallback(() => {

      setContent('');
      setImageUri(undefined);
      setReelUrl('');
      setType('post');

    }, []);

  // =========================
  // PICK IMAGE
  // =========================
  const handlePickImage =
    useCallback(async () => {

      const image:
        PickedImage | null =
          await pickImage();

      if (!image?.uri) {
        return;
      }

      setImageUri(
        image.uri
      );

    }, [
      pickImage,
    ]);

  // =========================
  // YOUTUBE THUMB
  // =========================
  const getYoutubeThumbnail =
    useCallback((
      url: string
    ) => {

      try {

        let videoId = '';

        if (
          url.includes(
            'youtube.com/shorts/'
          )
        ) {

          videoId =
            url
              .split(
                'shorts/'
              )[1]
              ?.split('?')[0];

        } else if (
          url.includes(
            'youtu.be/'
          )
        ) {

          videoId =
            url
              .split(
                'youtu.be/'
              )[1]
              ?.split('?')[0];

        } else if (
          url.includes(
            'watch?v='
          )
        ) {

          videoId =
            new URL(url)
              .searchParams
              .get('v') || '';
        }

        if (!videoId) {
          return '';
        }

        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      } catch {

        return '';
      }

    }, []);

  // =========================
  // USER DATA
  // =========================
  const userData =
    useMemo(() => {

      if (!user) {
        return null;
      }

      return {

        id:
          user.id,

        name:
          user.name,

        avatar:
          user.avatar || '',

        bio:
          user.bio || '',

        followersCount:
          user.followersCount || 0,

        followingCount:
          user.followingCount || 0,

        postsCount:
          user.postsCount || 0,

        role:
          user.role,
      };

    }, [
      user,
    ]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    useCallback(async () => {

      if (
        !user ||
        !userData ||
        loading
      ) {
        return;
      }

      // =========================
      // VALIDATIONS
      // =========================
      if (
        type === 'post' &&
        !content.trim() &&
        !imageUri
      ) {

        Alert.alert(
          'Error',
          'Agrega texto o una imagen.'
        );

        return;
      }

      if (
        type === 'reel' &&
        !reelUrl.trim()
      ) {

        Alert.alert(
          'Error',
          'Pega un enlace de YouTube.'
        );

        return;
      }

      try {

        setLoading(true);

        // =========================
        // REEL THUMBNAIL
        // =========================
        const thumbnail =
          type === 'reel'
            ? getYoutubeThumbnail(
                reelUrl
              )
            : undefined;

        // =========================
        // IMAGE UPLOAD
        // =========================
        let uploadedImage:
          | {
              original: string;
              medium: string;
              thumb: string;
            }
          | undefined;

        if (
          type === 'post' &&
          imageUri
        ) {

          uploadedImage =
            await uploadImage(
              imageUri
            );
        }

        // =========================
        // POST DATA
        // =========================
        const postData = {

          type,

          user:
            userData,

          content:
            content.trim(),

          likesCount: 0,

          commentsCount: 0,

          createdAt:
            serverTimestamp(),

          ...(type === 'post' &&
            uploadedImage && {

              image:
                uploadedImage,
            }),

          ...(type === 'reel'
            ? {

                reelUrl:
                  reelUrl.trim(),

                thumbnail,

                platform:
                  'youtube',
              }
            : {}),
        };

        // =========================
        // CREATE
        // =========================
        await createPost(
          postData as any
        );

        // =========================
        // SUCCESS
        // =========================
        resetForm();

        router.replace(
          '/(tabs)'
        );

      } catch (error) {

        console.log(
          'CREATE POST ERROR:',
          error
        );

        Alert.alert(
          'Error',
          'No se pudo publicar.'
        );

      } finally {

        setLoading(false);
      }

    }, [

      content,
      getYoutubeThumbnail,
      imageUri,
      loading,
      reelUrl,
      resetForm,
      router,
      type,
      user,
      userData,
    ]);

  return (

    <Screen>

      <Header
        title="Crear"

        onBack={() => {

          resetForm();

          router.back();
        }}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"

        contentContainerStyle={{

          padding:
            SPACING.lg,

          gap: 16,

          paddingBottom: 140,
        }}
      >

        <AppText
          style={{

            fontSize: 22,

            fontWeight:
              'bold',
          }}
        >
          Crear publicación
        </AppText>

        {/* TYPE */}
        <View
          style={{
            flexDirection:
              'row',

            gap: 12,
          }}
        >

          <Pressable
            onPress={() =>
              setType(
                'post'
              )
            }

            style={{

              flex: 1,

              padding: 14,

              borderRadius: 14,

              backgroundColor:
                type === 'post'
                  ? COLORS.primary
                  : COLORS.background,
            }}
          >

            <AppText
              style={{
                textAlign:
                  'center',
              }}
            >
              Post
            </AppText>

          </Pressable>

          <Pressable
            onPress={() =>
              setType(
                'reel'
              )
            }

            style={{

              flex: 1,

              padding: 14,

              borderRadius: 14,

              backgroundColor:
                type === 'reel'
                  ? COLORS.primary
                  : COLORS.background,
            }}
          >

            <AppText
              style={{
                textAlign:
                  'center',
              }}
            >
              Reel
            </AppText>

          </Pressable>

        </View>

        {/* CONTENT */}
        <TextInput
          placeholder=
            "¿Qué está pasando en EFMG?"

          placeholderTextColor={
            COLORS.textSecondary
          }

          value={content}

          onChangeText={
            setContent
          }

          multiline

          style={{

            minHeight: 120,

            backgroundColor:
              COLORS.background,

            borderRadius: 16,

            padding: 16,

            textAlignVertical:
              'top',

            color:
              COLORS.text,
          }}
        />

        {/* POST */}
        {type === 'post' && (

          <>

            {!!imageUri && (

              <Image
                source={{
                  uri: imageUri,
                }}

                cachePolicy="memory-disk"

                contentFit="cover"

                transition={120}

                style={{

                  width: '100%',

                  height: 220,

                  borderRadius: 18,
                }}
              />

            )}

            <AppButton
              title=
                "Seleccionar imagen"

              onPress={
                handlePickImage
              }
            />

          </>

        )}

        {/* REEL */}
        {type === 'reel' && (

          <TextInput
            placeholder=
              "Pega enlace de YouTube Shorts"

            placeholderTextColor={
              COLORS.textSecondary
            }

            value={reelUrl}

            onChangeText={
              setReelUrl
            }

            autoCapitalize="none"

            autoCorrect={false}

            style={{

              backgroundColor:
                COLORS.background,

              borderRadius: 16,

              padding: 16,

              color:
                COLORS.text,
            }}
          />

        )}

        <AppButton
          title={
            loading
              ? 'Publicando...'
              : 'Publicar'
          }

          disabled={loading}

          onPress={
            handleSubmit
          }
        />

      </ScrollView>

    </Screen>
  );
}