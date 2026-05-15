import { ReactNode } from 'react';
import { View } from 'react-native';

import { SPACING } from '../../theme';

type Props = {
  children: ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <View
      style={{
        paddingHorizontal: SPACING.md,
      }}
    >
      {children}
    </View>
  );
}