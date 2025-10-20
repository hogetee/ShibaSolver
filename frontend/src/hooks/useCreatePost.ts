import { useState } from 'react';
import { NewPostData } from '@/components/post/CreatePostModal';
import { PostData } from '@/components/post/Post';

interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

export const useCreatePost = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (postData: NewPostData): Promise<ApiResponse> => {
    setIsCreating(true);
    setError(null);

    const payload = {
      title: postData.title,
      description: postData.details,
      tags: postData.subjects,
      post_image: postData.imageUrl || null, // ✅ now sends Cloudinary link
    };

    try {
      const response = await fetch('http://localhost:5003/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to create post');

      return responseData as ApiResponse;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  return { createPost, isCreating, error };
};