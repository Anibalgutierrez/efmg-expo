import {
  View,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';

import {
  useState,
  useEffect,
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

import useImagePicker
from '../../hooks/useImagePicker';

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
  ReelPlatform,
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

  function resetForm() {

    setContent('');
    setImageUri(undefined);
    setReelUrl('');
    setType('post');
  }

  useEffect(() => {

    return () => {

      resetForm();
    };

  }, []);

  async function handlePickImage() {

    const uri =
      await pickImage();

    if (uri) {

      setImageUri(uri);
    }
  }

  function getYoutubeThumbnail(
    url: string
  ) {

    try {

      let videoId = '';

      if (
        url.includes(
          'youtube.com/shorts/'
        )
      ) {

        videoId =
          url.split(
            'shorts/'
          )[1]
          ?.split('?')[0];

      } else if (
        url.includes(
          'youtu.be/'
        )
      ) {

        videoId =
          url.split(
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
  }

  async function handleSubmit() {

  if (
    !user ||
    loading
  ) return;

  try {

    setLoading(true);

    let imageUrl = '';

    if (
      imageUri
    ) {

      imageUrl =
        await uploadImage(
          imageUri
        );
    }

    if (
      type === 'post'
    ) {

      await createPost({

        type,

        user: {

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
        },

        content,

        image:
          imageUrl || '',

        likesCount: 0,

        commentsCount: 0,

        createdAt:
          serverTimestamp() as any,
      });

    } else {

      const thumbnail =
        getYoutubeThumbnail(
          reelUrl
        );

      await createPost({

        type,

        user: {

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
        },

        content,

        image: '',

        likesCount: 0,

        commentsCount: 0,

        createdAt:
          serverTimestamp() as any,

        reelUrl,

        thumbnail,

        platform:
          'youtube',
      });
    }

    resetForm();

    router.replace('/(tabs)');

  } finally {

    setLoading(false);
  }
}

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
                type ===
                'post'
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
                type ===
                'reel'
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

            {imageUri && (

              <Image
                source={imageUri}

                contentFit="cover"

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