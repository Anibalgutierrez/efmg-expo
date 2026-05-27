import {
  View,
  Pressable,
} from 'react-native';

import {
  memo,
} from 'react';

import Avatar
from '../../../../components/ui/Avatar';

import AppText
from '../../../../components/ui/AppText';

import IconButton
from '../../../../components/ui/IconButton';

import useTheme
from '../../../../hooks/useTheme';

import {
  SPACING,
} from '../../../../theme';

import {
  Post,
} from '../../types/post.types';

type Props = {
  post: Post;
  createdAtText: string;
  isOwner: boolean;
  onPressProfile: () => void;
  onPressDelete: () => void;
};

function PostHeader({
  post,
  createdAtText,
  isOwner,
  onPressProfile,
  onPressDelete,
}: Props) {

  const {
    COLORS,
  } = useTheme();

  return (

    <View
      style={{

        flexDirection:
          'row',

        alignItems:
          'center',

        justifyContent:
          'space-between',

        marginBottom:
          SPACING.md,
      }}
    >

      <Pressable
        onPress={
          onPressProfile
        }

        style={{

          flexDirection:
            'row',

          alignItems:
            'center',

          flex: 1,
        }}
      >

        <Avatar
          uri={
            post.user.avatar
          }
        />

        <View
          style={{

            marginLeft: 12,

            flex: 1,
          }}
        >

          <AppText
            numberOfLines={1}

            style={{

              fontWeight:
                'bold',

              color:
                COLORS.text,
            }}
          >
            {post.user.name}
          </AppText>

          <AppText
            style={{

              color:
                COLORS.textSecondary,

              fontSize: 13,
            }}
          >
            {createdAtText}
          </AppText>

        </View>

      </Pressable>

      {isOwner ? (

        <IconButton
          icon="trash-outline"

          onPress={
            onPressDelete
          }
        />

      ) : (

        <IconButton
          icon="ellipsis-horizontal"
        />

      )}

    </View>
  );
}

export default memo(PostHeader);