import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  onSnapshot,
} from 'firebase/firestore';

import {
  db,
} from '../../firebase/config';

import Screen
from '../../components/ui/Screen';

import Container
from '../../components/ui/Container';

import Header
from '../../components/ui/Header';

import Loader
from '../../components/ui/Loader';

import EmptyState
from '../../components/ui/EmptyState';

import PostCard
from '../../features/posts/components/PostCard';

import {
  Post,
} from '../../features/posts/types/post.types';

export default function PostScreen() {

  const {
    id,
  } = useLocalSearchParams();

  const router =
    useRouter();

  const [post, setPost] =
    useState<Post | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!id) return;

    const postRef = doc(
      db,
      'posts',
      String(id)
    );

    const unsubscribe =
      onSnapshot(
        postRef,
        (snapshot) => {

          if (
            snapshot.exists()
          ) {

            setPost({
              id:
                snapshot.id,

              ...snapshot.data(),

            } as Post);

          } else {

            setPost(null);
          }

          setLoading(false);
        }
      );

    return unsubscribe;

  }, [id]);

  return (

    <Screen>

      <Header
        title="Post"

        onBack={() =>
          router.back()
        }
      />

      <Container>

        {loading ? (

          <Loader />

        ) : post ? (

          <PostCard
            post={post}
          />

        ) : (

          <EmptyState
            title=
              "Post no encontrado"
          />

        )}

      </Container>

    </Screen>
  );
}