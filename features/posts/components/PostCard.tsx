import {
    View,
    Pressable,
    Keyboard,
    useWindowDimensions,
} from 'react-native';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    useRouter,
} from 'expo-router';

import {
    useState,
} from 'react';

import {
    Image,
} from 'expo-image';

import Card
    from '../../../components/ui/Card';

import AppText
    from '../../../components/ui/AppText';

import Avatar
    from '../../../components/ui/Avatar';

import IconButton
    from '../../../components/ui/IconButton';

import Divider
    from '../../../components/ui/Divider';

import useLikePost
    from '../hooks/useLikePost';

import CommentsModal
    from '../../comments/components/CommentsModal';

import {
    useUserStore,
} from '../../../store/useUserStore';

import useTheme
    from '../../../hooks/useTheme';

import {
    SPACING,
} from '../../../theme';

import {
    Post,
} from '../../../types/post.types';

import {
    deletePost,
} from '../../../services/posts/delete-post.service';

import ConfirmModal
from './ConfirmModal';

type Props = {
    post: Post;
};

export default function PostCard({
    post,
}: Props) {

    const router =
        useRouter();

    const {
        width,
    } = useWindowDimensions();

    const {
        COLORS,
    } = useTheme();

    const [
        commentsVisible,
        setCommentsVisible,
    ] = useState(false);

    const [
        deleteVisible,
        setDeleteVisible,
    ] = useState(false);

    const user =
        useUserStore(
            (state) => state.user
        );

    const isOwner =
        user?.id ===
        post.user.id;

    const {
        liked,
        likes,
        toggleLike,
    } = useLikePost(
        post.id,
        post.likesCount,
        user?.id
    );

    async function handleDeletePost() {

        try {

            await deletePost(
                post.id
            );

            setDeleteVisible(
                false
            );

        } catch (error) {

            console.log(
                error
            );
        }
    }

    return (
        <>
            <Card>

                {/* HEADER */}
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
                        onPress={() => {

                            Keyboard.dismiss();

                            router.push(
                                `/profile/${post.user.id}`
                            );
                        }}

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
                                {(
                                    post.createdAt as any
                                )?.toDate
                                    ? (
                                        post.createdAt as any
                                    )
                                        .toDate()
                                        .toLocaleString()
                                    : new Date(
                                        post.createdAt as any
                                    ).toLocaleString()}
                            </AppText>

                        </View>

                    </Pressable>

                    {isOwner ? (

                        <IconButton
                            icon="trash-outline"

                            onPress={() =>
                                setDeleteVisible(
                                    true
                                )
                            }
                        />

                    ) : (

                        <IconButton
                            icon="ellipsis-horizontal"
                        />

                    )}

                </View>

                {/* CONTENT */}
                {!!post.content && (

                    <AppText
                        style={{

                            marginBottom:
                                SPACING.md,

                            lineHeight: 22,

                            color:
                                COLORS.text,
                        }}
                    >
                        {post.content}
                    </AppText>

                )}

                {/* REEL */}
                {post.type ===
                    'reel' && (
                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname:
                                    '/reels',

                                params: {
                                    reelId:
                                        post.id,
                                },
                            })
                        }
                    >

                        <View>

                            <Image
                                source={
                                    post.thumbnail
                                }

                                contentFit="cover"

                                transition={300}

                                style={{

                                    width: '100%',

                                    height:
                                        width > 500
                                            ? 520
                                            : 420,

                                    borderRadius: 18,

                                    marginBottom:
                                        SPACING.md,
                                }}
                            />

                            {/* PLAY ICON */}
                            <View
                                style={{

                                    position:
                                        'absolute',

                                    top: '50%',

                                    left: '50%',

                                    transform: [
                                        {
                                            translateX:
                                                -40,
                                        },
                                        {
                                            translateY:
                                                -40,
                                        },
                                    ],

                                    backgroundColor:
                                        'rgba(0,0,0,0.5)',

                                    width: 80,

                                    height: 80,

                                    borderRadius: 40,

                                    justifyContent:
                                        'center',

                                    alignItems:
                                        'center',
                                }}
                            >

                                <Ionicons
                                    name="play"
                                    size={44}
                                    color="white"
                                />

                            </View>

                        </View>

                    </Pressable>
                )}

                {/* NORMAL IMAGE */}
                {post.type ===
                    'post' &&
                    post.image && (

                        <Image
                            source={
                                post.image
                            }

                            contentFit="cover"

                            transition={300}

                            style={{

                                width: '100%',

                                height:
                                    width > 500
                                        ? 360
                                        : 240,

                                borderRadius: 18,

                                marginBottom:
                                    SPACING.md,
                            }}
                        />

                    )}

                <Divider />

                {/* ACTIONS */}
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
                            toggleLike
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
                        onPress={() =>
                            setCommentsVisible(
                                true
                            )
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
                            💬 {post.commentsCount}
                        </AppText>

                    </Pressable>

                </View>

            </Card>

            <CommentsModal
                visible={
                    commentsVisible
                }

                onClose={() =>
                    setCommentsVisible(
                        false
                    )
                }

                postId={
                    post.id
                }

                postOwnerId={
                    post.user.id
                }
            />

            <ConfirmModal
                visible={
                    deleteVisible
                }

                title=
                    "Eliminar publicación"

                description=
                    "Esta acción no se puede deshacer."

                onCancel={() =>
                    setDeleteVisible(
                        false
                    )
                }

                onConfirm={
                    handleDeletePost
                }
            />
        </>
    );
}