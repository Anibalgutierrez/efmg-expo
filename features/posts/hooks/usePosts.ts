import { useEffect, useState } from 'react';

import {subscribeToPosts,} from '../../../services/posts/posts.service';

import { Post }
from '../../../types/post.types';

export default function usePosts() {
    const [posts, setPosts] = useState<Post[]>(
        []
    );

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const unsubscribe =
            subscribeToPosts((data) => {
                setPosts(data);

                setLoading(false);
            });

        return unsubscribe;
    }, []);

    return {
        posts,
        loading,
    };
}