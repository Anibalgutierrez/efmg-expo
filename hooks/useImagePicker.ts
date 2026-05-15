import * as ImagePicker
from 'expo-image-picker';

export default function useImagePicker() {
  async function pickImage() {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 0.7,
      });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  }

  return {
    pickImage,
  };
}