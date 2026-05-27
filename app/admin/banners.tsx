import {
  View,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';

import {
  useState,
} from 'react';

import Screen
from '../../components/ui/Screen';

import Container
from '../../components/ui/Container';

import AppButton
from '../../components/ui/AppButton';

import AppText
from '../../components/ui/AppText';

import Card
from '../../components/ui/Card';

import useImagePicker, {
  PickedImage,
} from '../../hooks/useImagePicker';

import {
  uploadImage,
} from '../../services/storage/storage.service';

import {
  createBanner,
} from '../../services/banners/banners.service';

import useBanners
from '../../features/hero/hooks/useBanners';

import {
  SPACING,
} from '../../theme';

import useTheme
from '../../hooks/useTheme';

import {
  Redirect,
} from 'expo-router';

import useIsAdmin
from '../../hooks/useIsAdmin';

export default function AdminBannersScreen() {

  const {
    COLORS,
  } = useTheme();

  const isAdmin =
    useIsAdmin();

  const {
    banners,
  } = useBanners();

  const {
    pickImage,
  } = useImagePicker();

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    subtitle,
    setSubtitle,
  ] = useState('');

  const [
    uploading,
    setUploading,
  ] = useState(false);

  async function handleCreateBanner() {

    try {

      setUploading(true);

      // =========================
      // PICK IMAGE
      // =========================
      const picked =
        await pickImage({

          multiple: false,
        });

      if (
        !picked ||
        picked.length === 0
      ) {
        return;
      }

      const image =
        picked[0] as PickedImage;

      // =========================
      // UPLOAD IMAGE
      // =========================
      const uploadedImage =
        await uploadImage(

          image.uri,

          'banners'
        );

      console.log(
        'BANNER IMAGE:',
        uploadedImage
      );

      // =========================
      // CREATE BANNER
      // =========================
      await createBanner({

        title:
          title.trim(),

        subtitle:
          subtitle.trim(),

        image:
          uploadedImage,

        active: true,

        order:
          banners.length + 1,

        actionType:
          'route',

        actionValue:
          '/',
      });

      Alert.alert(
        'Éxito',
        'Banner creado'
      );

      setTitle('');
      setSubtitle('');

    } catch (error) {

      console.log(
        'CREATE BANNER ERROR:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudo crear el banner'
      );

    } finally {

      setUploading(false);
    }
  }

  if (!isAdmin) {

    return (
      <Redirect
        href="/"
      />
    );
  }

  return (

    <Screen>

      <FlatList
        data={banners}

        keyExtractor={(item) =>
          item.id
        }

        contentContainerStyle={{
          paddingBottom: 120,
        }}

        ListHeaderComponent={
          <Container>

            <AppText
              style={{

                fontSize: 28,

                fontWeight:
                  'bold',

                color:
                  COLORS.text,

                marginBottom:
                  SPACING.xl,
              }}
            >
              Admin Banners
            </AppText>

            {/* TITLE */}
            <TextInput
              placeholder=
                "Título"

              placeholderTextColor={
                COLORS.textSecondary
              }

              value={title}

              onChangeText={
                setTitle
              }

              style={{

                backgroundColor:
                  COLORS.surface,

                borderRadius: 14,

                padding: 16,

                color:
                  COLORS.text,

                borderWidth: 1,

                borderColor:
                  COLORS.border,

                marginBottom:
                  SPACING.md,
              }}
            />

            {/* SUBTITLE */}
            <TextInput
              placeholder=
                "Subtítulo"

              placeholderTextColor={
                COLORS.textSecondary
              }

              value={subtitle}

              onChangeText={
                setSubtitle
              }

              style={{

                backgroundColor:
                  COLORS.surface,

                borderRadius: 14,

                padding: 16,

                color:
                  COLORS.text,

                borderWidth: 1,

                borderColor:
                  COLORS.border,

                marginBottom:
                  SPACING.lg,
              }}
            />

            {/* BUTTON */}
            <AppButton
              title={
                uploading
                  ? 'Subiendo...'
                  : 'Crear Banner'
              }

              onPress={
                handleCreateBanner
              }
            />

            {/* LIST */}
            <AppText
              style={{

                fontSize: 20,

                fontWeight:
                  'bold',

                color:
                  COLORS.text,

                marginTop:
                  SPACING.xxl,

                marginBottom:
                  SPACING.lg,
              }}
            >
              Banners Activos
            </AppText>

          </Container>
        }

        renderItem={({ item }) => (

          <Container>

            <Card>

              <AppText
                style={{

                  fontWeight:
                    'bold',

                  fontSize: 18,

                  color:
                    COLORS.text,
                }}
              >
                {item.title}
              </AppText>

              <AppText
                style={{

                  marginTop: 6,

                  color:
                    COLORS.textSecondary,
                }}
              >
                {item.subtitle}
              </AppText>

            </Card>

          </Container>
        )}
      />

    </Screen>
  );
}