import {
  View,
  TextInput,
  FlatList,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  serverTimestamp,
} from 'firebase/firestore';

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

import useImagePicker
from '../../hooks/useImagePicker';

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

      const imageUri =
        await pickImage();

      if (!imageUri) {
        return;
      }

      const imageUrl =
        await uploadImage(
          imageUri
        );

      await createBanner({

        title,

        subtitle,

        image:
          imageUrl,

        active: true,

        order:
          banners.length + 1,

        createdAt:
          serverTimestamp() as any,
      });

      setTitle('');
      setSubtitle('');

    } catch (error) {

      console.log(
        error
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