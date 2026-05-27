import * as ImagePicker
from 'expo-image-picker';

export type PickedImage = {

  uri: string;

  width: number;

  height: number;
};

type Options = {

  multiple?: boolean;

  limit?: number;
};

export default function useImagePicker() {

  async function pickImage(
    options?: Options
  ): Promise<
    PickedImage[] | null
  > {

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ['images'],

        allowsMultipleSelection:
          options?.multiple || false,

        selectionLimit:
          options?.multiple
            ? (
                options.limit || 0
              )
            : 1,

        quality: 0.8,
      });

    if (
      result.canceled
    ) {

      return null;
    }

    return result.assets.map(
      (asset) => ({

        uri:
          asset.uri,

        width:
          asset.width,

        height:
          asset.height,
      })
    );
  }

  return {
    pickImage,
  };
}