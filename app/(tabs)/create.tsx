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
} from '../../features/posts/types/post.types';

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
    imageUris,
    setImageUris,
  ] = useState<string[]>(
    []
  );

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
      setImageUris([]);
      setReelUrl('');
      setType('post');

    }, []);

  // =========================
  // PICK IMAGES
  // =========================
  const handlePickImage =
    useCallback(async () => {

      const remaining =
        5 - imageUris.length;

      if (
        remaining <= 0
      ) {
        return;
      }

      const images =
        await pickImage({

          multiple: true,

          limit: remaining,
        });

      if (
        !images ||
        images.length === 0
      ) {
        return;
      }

      const uris =
        images.map(
          (
            image: PickedImage
          ) => image.uri
        );

      setImageUris(
        (prev) => [

          ...prev,

          ...uris,
        ].slice(0, 5)
      );

    }, [
      imageUris.length,
      pickImage,
    ]);

  // =========================
  // REMOVE IMAGE
  // =========================
  const removeImage =
    useCallback((
      uri: string
    ) => {

      setImageUris(
        (prev) =>

          prev.filter(
            (item) =>
              item !== uri
          )
      );

    }, []);

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
        imageUris.length === 0
      ) {

        Alert.alert(
          'Error',
          'Agrega texto o imágenes.'
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
        // IMAGE UPLOADS
        // =========================
        let uploadedImages:
          | {
              original: string;
              medium: string;
              thumb: string;
            }[]
          | undefined;

        if (
          type === 'post' &&
          imageUris.length > 0
        ) {

          uploadedImages =
            await Promise.all(

              imageUris.map(
                (
                  uri
                ) =>

                  uploadImage(
                    uri
                  )
              )
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
            uploadedImages && {

              images:
                uploadedImages,
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
      imageUris,
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
        title="Crear Posts"
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

            {imageUris.length > 0 && (

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }

                contentContainerStyle={{
                  gap: 12,
                }}
              >

                {imageUris.map(
                  (uri) => (

                    <View
                      key={uri}
                    >

                      <Image
                        source={{
                          uri,
                        }}

                        recyclingKey={
                          uri
                        }

                        cachePolicy="memory-disk"

                        contentFit="cover"

                        transition={120}

                        style={{

                          width: 180,

                          height: 180,

                          borderRadius: 18,
                        }}
                      />

                      <Pressable
                        onPress={() =>
                          removeImage(
                            uri
                          )
                        }

                        style={{

                          position:
                            'absolute',

                          top: 8,

                          right: 8,

                          width: 28,

                          height: 28,

                          borderRadius: 999,

                          backgroundColor:
                            'rgba(0,0,0,0.7)',

                          justifyContent:
                            'center',

                          alignItems:
                            'center',
                        }}
                      >

                        <AppText
                          style={{
                            color:
                              'white',

                            fontWeight:
                              'bold',
                          }}
                        >
                          ✕
                        </AppText>

                      </Pressable>

                    </View>
                  )
                )}

              </ScrollView>

            )}

            <AppButton
              title={
                imageUris.length >= 5
                  ? 'Máximo 5 imágenes'
                  : `Agregar imágenes (${imageUris.length}/5)`
              }

              disabled={
                imageUris.length >= 5
              }

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