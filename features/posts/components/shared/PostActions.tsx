import {
  View,
  Pressable,
} from 'react-native';

import {
  memo,
} from 'react';

import AppText
from '../../../../components/ui/AppText';

import useTheme
from '../../../../hooks/useTheme';

import {
  SPACING,
} from '../../../../theme';

type Props = {
  liked: boolean;
  likes: number;
  commentsCount: number;
  onLike: () => void;
  onComments: () => void;
};

function PostActions({
  liked,
  likes,
  commentsCount,
  onLike,
  onComments,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{

        flexDirection:
          'row',

        justifyContent:
          'space-around',

        marginTop:
          SPACING.md,
      }}
    >

      <Pressable
        onPress={
          onLike
        }

        style={{
          padding: 8,
        }}
      >

        <AppText
          style={{
            color:
              COLORS.text,
          }}
        >

          {liked
            ? '❤️'
            : '🤍'}{' '}

          {likes}

        </AppText>

      </Pressable>

      <Pressable
        onPress={
          onComments
        }

        style={{
          padding: 8,
        }}
      >

        <AppText
          style={{
            color:
              COLORS.text,
          }}
        >
          💬 {commentsCount}
        </AppText>

      </Pressable>

    </View>
  );
}

export default memo(PostActions);