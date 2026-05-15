export function detectPlatform(
  url: string
) {

  if (
    url.includes(
      'youtube'
    ) ||
    url.includes(
      'youtu.be'
    )
  ) {
    return 'youtube';
  }

  if (
    url.includes(
      'tiktok'
    )
  ) {
    return 'tiktok';
  }

  if (
    url.includes(
      'instagram'
    )
  ) {
    return 'instagram';
  }

  return null;
}

export function getYoutubeThumbnail(
  url: string
) {

  const match =
    url.match(
      /(?:youtube\.com\/shorts\/|youtu\.be\/)([^?&]+)/
    );

  if (!match) {
    return '';
  }

  const videoId =
    match[1];

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}