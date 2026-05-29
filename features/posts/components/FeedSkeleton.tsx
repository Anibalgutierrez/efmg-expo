import {
  View,
} from 'react-native';

import Skeleton
from '../../../components/ui/Skeleton';

import {
  SPACING,
} from '../../../theme';

export default function FeedSkeleton() {

  return (

    <View
      style={{
        padding: SPACING.md,
        gap: SPACING.xl,
      }}
    >

      {[1, 2, 3].map((item) => (

        <View
          key={item}
          style={{
            gap: SPACING.md,
          }}
        >

          {/* HEADER */}
          <Skeleton
            width={160}
            height={18}
          />

          {/* IMAGE */}
          <Skeleton
            width="100%"
            height={260}
            radius={18}
          />

          {/* ACTIONS */}
          <Skeleton
            width={120}
            height={16}
          />

        </View>

      ))}

    </View>
  );
}