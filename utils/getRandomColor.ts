const COLORS = [

  '#2563EB',
  '#7C3AED',
  '#DC2626',
  '#059669',
  '#EA580C',
  '#0891B2',
];

export function getBannerColor(
  seed: string,
) {

  let hash = 0;

  for (
    let i = 0;
    i < seed.length;
    i++
  ) {

    hash =
      seed.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  const index =
    Math.abs(hash) %
    COLORS.length;

  return COLORS[index];
}