import * as ImagePicker
from 'expo-image-picker';

import * as ImageManipulator
from 'expo-image-manipulator';

import {
  Alert,
} from 'react-native';

export type PickedImage = {

  uri: string;

  width: number;

  height: number;
};

type PickImageOptions = {

  multiple?: boolean;

  limit?: number;
};

export default function useImagePicker() {

  async function pickImage(
    options?: PickImageOptions
  ): Promise<
    PickedImage[]
  > {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      !permission.granted
    ) {

      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tus imágenes.'
      );

      return [];
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsEditing:
          !options?.multiple,

        allowsMultipleSelection:
          options?.multiple || false,

        selectionLimit:
          options?.limit || 1,

        quality: 1,
      });

    if (
      result.canceled
    ) {

      return [];
    }

    try {

      const optimizedImages =
        await Promise.all(

          result.assets.map(
            async (
              asset
            ) => {

              const optimized =
                await ImageManipulator.manipulateAsync(

                  asset.uri,

                  [
                    {
                      resize: {
                        width: 1280,
                      },
                    },
                  ],

                  {

                    compress: 0.7,

                    format:
                      ImageManipulator.SaveFormat.WEBP,
                  }
                );

              return {

                uri:
                  optimized.uri,

                width:
                  optimized.width,

                height:
                  optimized.height,
              };
            }
          )
        );

      return optimizedImages;

    } catch {

      Alert.alert(
        'Error',
        'No se pudo procesar la imagen.'
      );

      return [];
    }
  }

  return {
    pickImage,
  };
}