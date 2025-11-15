import { useState } from 'react';
import { PostData } from '@/components/post/Post';
import { UpdatedPostData } from '@/components/post/EditPostModal';

interface UpdatePostApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

interface UpdatePostPayload {
  title: string;
  description: string;
  is_solved: boolean;
  tags: string[];
  post_image?: string | null; // ✅ add this
}

export const useUpdatePost = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePost = async (
    postId: string,
    dataToUpdate: UpdatedPostData
  ): Promise<UpdatePostApiResponse> => {
    setIsUpdating(true);
    setError(null);

    const payload: UpdatePostPayload = {
      title: dataToUpdate.title,
      description: dataToUpdate.details,
      is_solved: dataToUpdate.is_solved,
      tags: dataToUpdate.subjects,
      post_image: dataToUpdate.imageUrl || null, // ✅ send Cloudinary URL
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL  ;

    try {
      const response = await fetch(`${API_BASE}/api/v1/posts/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to update post');

      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePost, isUpdating, error };
};