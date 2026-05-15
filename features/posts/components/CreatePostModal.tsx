import {
  Modal,
  View,
  TextInput,
  Pressable,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  Image,
} from 'expo-image';

import AppButton
from '../../../components/ui/AppButton';

import AppText
from '../../../components/ui/AppText';

import {
  SPACING,
} from '../../../theme';

import useTheme
from '../../../hooks/useTheme';

import {
  PostType,
  ReelPlatform,
} from '../../../types/post.types';

type Props = {

  visible: boolean;

  onClose: () => void;

  onSubmit: (
    data: {
      type: PostType;
      content: string;
      imageUri?: string;
      reelUrl?: string;
      thumbnail?: string;
      platform?: ReelPlatform;
    }
  ) => Promise<void>;

  onPickImage: () => Promise<
    string | null
  >;
};

export default function CreatePostModal({

  visible,
  onClose,
  onSubmit,
  onPickImage,

}: Props) {

  const {
    COLORS,
  } = useTheme();

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

  async function handlePickImage() {

    const uri =
      await onPickImage();

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
      type === 'post'
    ) {

      await onSubmit({

        type,

        content,

        imageUri,
      });

    } else {

      const thumbnail =
        getYoutubeThumbnail(
          reelUrl
        );

      await onSubmit({

        type,

        content,

        reelUrl,

        thumbnail,

        platform:
          'youtube',
      });
    }

    setContent('');
    setImageUri(undefined);
    setReelUrl('');
    setType('post');

    onClose();
  }

  return (

    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >

      <View
        style={{

          flex: 1,

          justifyContent:
            'flex-end',

          backgroundColor:
            COLORS.overlay,
        }}
      >

        <View
          style={{

            backgroundColor:
              COLORS.surface,

            padding:
              SPACING.lg,

            borderTopLeftRadius:
              24,

            borderTopRightRadius:
              24,

            gap: 16,
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
            title=
              "Publicar"

            onPress={
              handleSubmit
            }
          />

          <AppButton
            title=
              "Cancelar"

            onPress={
              onClose
            }
          />

        </View>

      </View>

    </Modal>
  );
}