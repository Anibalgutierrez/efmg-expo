import {
  View,
  Pressable,
} from 'react-native';

import {
  useRouter,
} from 'expo-router';

import Avatar
from '../../../components/ui/Avatar';

import AppText
from '../../../components/ui/AppText';

import Card
from '../../../components/ui/Card';

import {
  SPACING,
} from '../../../theme';

import useTheme
from '../../../hooks/useTheme';

import {
  Notification,
} from '../../../types/notification.types';

type Props = {
  notification: Notification;
};

export default function NotificationCard({
  notification,
}: Props) {

  const router =
    useRouter();

  const {
    COLORS,
  } = useTheme();

  function formatTime(
    timestamp: any
  ) {

    if (!timestamp) {
      return '';
    }

    const date =
      new Date(timestamp);

    return date.toLocaleString();
  }

  return (

    <Pressable
      onPress={() => {

        if (
          notification.postId
        ) {

          router.push(
            `/post/${notification.postId}`
          );
        }
      }}
    >

      <Card>

        <View
          style={{
            flexDirection:
              'row',

            alignItems:
              'center',
          }}
        >

          <Avatar
            uri={
              notification.senderAvatar
            }
          />

          <View
            style={{
              marginLeft:
                SPACING.md,

              flex: 1,
            }}
          >

            <AppText
              style={{
                lineHeight: 22,

                color:
                  COLORS.text,
              }}
            >

              <AppText
                style={{
                  fontWeight:
                    'bold',

                  color:
                    COLORS.text,
                }}
              >
                {
                  notification.senderName
                }
              </AppText>

              {' '}

              {
                notification.text
              }

            </AppText>

            <AppText
              style={{
                marginTop: 4,

                color:
                  COLORS.textSecondary,

                fontSize: 12,
              }}
            >
              {formatTime(
                notification.createdAt
              )}
            </AppText>

          </View>

          {!notification.read && (

            <View
              style={{
                width: 10,
                height: 10,

                borderRadius: 999,

                backgroundColor:
                  COLORS.primary,
              }}
            />

          )}

        </View>

      </Card>

    </Pressable>
  );
}