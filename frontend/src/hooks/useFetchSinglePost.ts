import { useState, useEffect } from 'react';
import { PostData } from '@/components/post/Post';

interface ApiResponse {
  success: boolean;
  data: PostData[];
}

export const useFetchSinglePost = (postId: string) => {
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/v1/posts/${postId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const responseData: ApiResponse = await response.json();

        setPost(responseData.data[0] || null);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [postId]);

  return { post, setPost, isLoading, error };
};