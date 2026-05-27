import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';

import {
  db,
} from '../../../firebase/config';

import {
  Post,
} from '../types/post.types';

import {
  usePostsStore,
} from '../store/usePostsStore';

import useImagePrefetch
from '../../../hooks/useImagePrefetch';

const PAGE_SIZE = 10;

export default function usePosts() {

  const posts =
    usePostsStore(
      (state) => state.posts
    );

  const setPosts =
    usePostsStore(
      (state) => state.setPosts
    );

  const mergePosts =
    usePostsStore(
      (state) => state.mergePosts
    );

  const appendPosts =
    usePostsStore(
      (state) => state.appendPosts
    );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    hasMore,
    setHasMore,
  ] = useState(true);

  const lastDocRef =
    useRef<
      QueryDocumentSnapshot<DocumentData>
      | null
    >(null);

  const initializedRef =
    useRef(false);

  // =========================
  // SERIALIZER
  // =========================
  const serializePosts =
    useCallback(
      (
        snapshot: any
      ): Post[] => {

        return snapshot.docs.map(
          (doc: any) => ({

            id: doc.id,

            ...doc.data(),

          })
        ) as Post[];
      },
      []
    );

  // =========================
  // INITIAL LOAD
  // =========================
  const loadInitialPosts =
    useCallback(async () => {

      try {

        setLoading(true);

        const q = query(

          collection(
            db,
            'posts'
          ),

          orderBy(
            'createdAt',
            'desc'
          ),

          limit(
            PAGE_SIZE
          )
        );

        const snapshot =
          await getDocs(q);

        const fetchedPosts =
          serializePosts(
            snapshot
          );

        setPosts(
          fetchedPosts
        );

        lastDocRef.current =
          snapshot.docs[
            snapshot.docs.length - 1
          ] || null;

        setHasMore(
          snapshot.docs.length >=
          PAGE_SIZE
        );

      } catch (error) {

        console.log(
          'LOAD POSTS ERROR:',
          error
        );

      } finally {

        setLoading(false);
      }

    }, [
      serializePosts,
      setPosts,
    ]);

  // =========================
  // LOAD MORE
  // =========================
  const loadMorePosts =
    useCallback(async () => {

      if (
        loadingMore ||
        !hasMore ||
        !lastDocRef.current
      ) return;

      try {

        setLoadingMore(true);

        const q = query(

          collection(
            db,
            'posts'
          ),

          orderBy(
            'createdAt',
            'desc'
          ),

          startAfter(
            lastDocRef.current
          ),

          limit(
            PAGE_SIZE
          )
        );

        const snapshot =
          await getDocs(q);

        const fetchedPosts =
          serializePosts(
            snapshot
          );

        appendPosts(
          fetchedPosts
        );

        lastDocRef.current =
          snapshot.docs[
            snapshot.docs.length - 1
          ] || null;

        setHasMore(
          snapshot.docs.length >=
          PAGE_SIZE
        );

      } catch (error) {

        console.log(
          'LOAD MORE ERROR:',
          error
        );

      } finally {

        setLoadingMore(false);
      }

    }, [

      appendPosts,

      hasMore,

      loadingMore,

      serializePosts,
    ]);

  // =========================
  // REFRESH
  // =========================
  const refreshPosts =
    useCallback(async () => {

      try {

        setRefreshing(true);

        const q = query(

          collection(
            db,
            'posts'
          ),

          orderBy(
            'createdAt',
            'desc'
          ),

          limit(
            PAGE_SIZE
          )
        );

        const snapshot =
          await getDocs(q);

        const fetchedPosts =
          serializePosts(
            snapshot
          );

        setPosts(
          fetchedPosts
        );

        lastDocRef.current =
          snapshot.docs[
            snapshot.docs.length - 1
          ] || null;

        setHasMore(
          snapshot.docs.length >=
          PAGE_SIZE
        );

      } catch (error) {

        console.log(
          'REFRESH ERROR:',
          error
        );

      } finally {

        setRefreshing(false);
      }

    }, [
      serializePosts,
      setPosts,
    ]);

  // =========================
  // FIRST LOAD
  // =========================
  useEffect(() => {

    if (
      initializedRef.current
    ) return;

    initializedRef.current =
      true;

    if (
      posts.length === 0
    ) {

      loadInitialPosts();
    }

  }, []);

  // =========================
  // REALTIME TOP POSTS
  // =========================
  useEffect(() => {

    const q = query(

      collection(
        db,
        'posts'
      ),

      orderBy(
        'createdAt',
        'desc'
      ),

      limit(
        PAGE_SIZE
      )
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          const fetchedPosts =
            serializePosts(
              snapshot
            );

          mergePosts(
            fetchedPosts
          );

          lastDocRef.current =
            snapshot.docs[
              snapshot.docs.length - 1
            ] || null;

          setHasMore(
            snapshot.docs.length >=
            PAGE_SIZE
          );
        }
      );

    return () =>
      unsubscribe();

  }, [
    mergePosts,
    serializePosts,
  ]);

  // =========================
  // PREFETCH IMAGES
  // =========================
  const imageUrls =
    useMemo(() => {

      return posts
        .flatMap(
          (post) => [

            post.user?.avatar,

            ...(post.images || []).map(
              (img) =>

                img.medium ||
                img.original ||
                img.thumb
            ),

            post.thumbnail,
          ]
        )
        .filter(
          Boolean
        ) as string[];

    }, [
      posts,
    ]);

  useImagePrefetch(
    imageUrls
  );

  return {

    posts,

    loading,

    loadingMore,

    refreshing,

    hasMore,

    loadMorePosts,

    refreshPosts,
  };
}