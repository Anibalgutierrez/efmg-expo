import {
  View,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from 'react-native';

import {
  useState,
  useCallback,
} from 'react';

import {
  useRouter,
} from 'expo-router';

import {
  Image,
} from 'expo-image';

import Screen
  from '../../components/ui/Screen';

import Header
  from '../../components/ui/Header';

import AppButton
  from '../../components/ui/AppButton';

import AppText
  from '../../components/ui/AppText';

import useTheme
  from '../../hooks/useTheme';

import useImagePicker, {
  PickedImage,
} from '../../hooks/useImagePicker';

import {
  uploadImage,
} from '../../services/storage/storage.service';

import {
  createBanner,
} from '../../features/hero/services/create-banner.service';

import {
  SPACING,
} from '../../theme';

export default function CreateBannerScreen() {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  const {
    pickImage,
  } = useImagePicker();

  // =========================
  // STATE
  // =========================
  const [
    title,
    setTitle,
  ] = useState('');

  const [
    subtitle,
    setSubtitle,
  ] = useState('');

  const [
    buttonText,
    setButtonText,
  ] = useState('');

  const [
    actionType,
    setActionType,
  ] = useState<
    'route' |
    'match' |
    'external'
  >('route');

  const [
    actionValue,
    setActionValue,
  ] = useState('');

  const [
    imageUri,
    setImageUri,
  ] = useState('');

  const [
    active,
    setActive,
  ] = useState(true);

  const [
    order,
    setOrder,
  ] = useState('0');

  const [
    loading,
    setLoading,
  ] = useState(false);

  // =========================
  // PICK IMAGE
  // =========================
  const handlePickImage =
    useCallback(async () => {

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
        images[0] as PickedImage;

      setImageUri(
        image.uri
      );

    }, [
      pickImage,
    ]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    useCallback(async () => {

      console.log(
        'IMAGE URI:',
        imageUri
      );

      if (
        loading
      ) {
        return;
      }

      if (
        !title.trim()
      ) {

        Alert.alert(
          'Error',
          'El banner necesita un título.'
        );

        return;
      }

      if (
        !actionValue.trim()
      ) {

        Alert.alert(
          'Error',
          'Completa la acción.'
        );

        return;
      }

      try {

        setLoading(true);

        let uploadedImage:
          | undefined
          | {
              original: string;
              medium: string;
              thumb: string;
            };

        // =========================
        // UPLOAD IMAGE
        // =========================
        if (
          imageUri
        ) {

          console.log(
            'UPLOADING IMAGE...'
          );

          uploadedImage =
            await uploadImage(
              imageUri,
              'banners'
            );

          console.log(
            'UPLOADED IMAGE:',
            uploadedImage
          );
        }

        // =========================
        // CREATE PAYLOAD
        // =========================
        const payload = {

          title:
            title.trim(),

          subtitle:
            subtitle.trim(),

          buttonText:
            buttonText.trim(),

          actionType,

          actionValue:
            actionValue.trim(),

          image:
            uploadedImage || undefined,

          active,

          order:
            Number(order) || 0,
        };

        console.log(
          'BANNER PAYLOAD:',
          payload
        );

        // =========================
        // CREATE
        // =========================
        await createBanner(
          payload
        );

        console.log(
          'BANNER CREATED'
        );

        Alert.alert(
          'Éxito',
          'Banner creado.'
        );

        router.back();

      } catch (error) {

        console.log(
          'CREATE BANNER ERROR:',
          error
        );

        Alert.alert(
          'Error',
          'No se pudo crear el banner.'
        );

      } finally {

        setLoading(false);
      }

    }, [

      actionType,
      actionValue,
      active,
      buttonText,
      imageUri,
      loading,
      order,
      router,
      subtitle,
      title,
    ]);

  return (

    <Screen>

      <Header
        title="Crear Banner"
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

        {/* TITLE */}
        <TextInput
          placeholder="Título"

          placeholderTextColor={
            COLORS.textSecondary
          }

          value={title}

          onChangeText={
            setTitle
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

        {/* SUBTITLE */}
        <TextInput
          placeholder="Subtítulo"

          placeholderTextColor={
            COLORS.textSecondary
          }

          value={subtitle}

          onChangeText={
            setSubtitle
          }

          multiline

          style={{

            minHeight: 100,

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

        {/* BUTTON */}
        <TextInput
          placeholder="Texto del botón"

          placeholderTextColor={
            COLORS.textSecondary
          }

          value={buttonText}

          onChangeText={
            setButtonText
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

        {/* ACTION TYPE */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}
        >

          {[
            'route',
            'match',
            'external',
          ].map((type) => (

            <Pressable
              key={type}

              onPress={() =>

                setActionType(
                  type as
                    | 'route'
                    | 'match'
                    | 'external'
                )
              }

              style={{

                flex: 1,

                padding: 14,

                borderRadius: 14,

                backgroundColor:

                  actionType === type
                    ? COLORS.primary
                    : COLORS.background,
              }}
            >

              <AppText
                style={{
                  textAlign: 'center',
                }}
              >
                {type}
              </AppText>

            </Pressable>

          ))}

        </View>

        {/* ACTION VALUE */}
        <TextInput
          placeholder="Acción"

          placeholderTextColor={
            COLORS.textSecondary
          }

          value={actionValue}

          onChangeText={
            setActionValue
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

        {/* ORDER */}
        <TextInput
          placeholder="Orden"

          keyboardType="numeric"

          placeholderTextColor={
            COLORS.textSecondary
          }

          value={order}

          onChangeText={
            setOrder
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

        {/* ACTIVE */}
        <View
          style={{

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
              'space-between',
          }}
        >

          <AppText>
            Banner activo
          </AppText>

          <Switch
            value={active}
            onValueChange={
              setActive
            }
          />

        </View>

        {/* IMAGE */}
        {imageUri ? (

          <Image
            source={{
              uri: imageUri,
            }}

            contentFit="cover"

            style={{

              width: '100%',

              height: 220,

              borderRadius: 18,
            }}
          />

        ) : null}

        <AppButton
          title="Seleccionar imagen"
          onPress={
            handlePickImage
          }
        />

        {/* SUBMIT */}
        <AppButton
          title={
            loading
              ? 'Creando...'
              : 'Crear Banner'
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