import ContentLoader, {
  Rect,
} from 'react-content-loader/native';

import useTheme
from '../../hooks/useTheme';

type Props = {
  width: number | string;
  height: number;
  radius?: number;
};

export default function Skeleton({
  width,
  height,
  radius = 12,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <ContentLoader
      speed={1.2}
      width={width}
      height={height}
      backgroundColor={COLORS.surface}
      foregroundColor={COLORS.surfaceLight}
    >

      <Rect
        x="0"
        y="0"
        rx={radius}
        ry={radius}
        width={width}
        height={height}
      />

    </ContentLoader>
  );
}