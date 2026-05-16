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

export default function useImagePicker() {

  async function pickImage():
    Promise<
      PickedImage | null
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

      return null;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        allowsEditing: true,

        quality: 1,
      });

    if (
      result.canceled
    ) {

      return null;
    }

    try {

      const asset =
        result.assets[0];

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

    } catch {

      Alert.alert(
        'Error',
        'No se pudo procesar la imagen.'
      );

      return null;
    }
  }

  return {
    pickImage,
  };
}