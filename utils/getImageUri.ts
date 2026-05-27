type ImageSizes = {
  original?: string;
  medium?: string;
  thumb?: string;
};

export function getImageUri(
  image?:
    | string
    | ImageSizes
    | null
) {

  if (!image) {
    return '';
  }

  // STRING
  if (typeof image === 'string') {
    return image;
  }

  // OBJECT
  return (
    image.medium ||
    image.original ||
    image.thumb ||
    ''
  );
}