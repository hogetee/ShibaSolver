import { useState } from 'react';
import { NewPostData } from '@/components/post/CreatePostModal'; // Import type จาก Component
import { PostData } from '@/components/post/Post';

// กำหนดหน้าตาของข้อมูลที่ API ตอบกลับมา
interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

export const useCreatePost = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (postData: NewPostData): Promise<ApiResponse> => {
    setIsCreating(true);
    setError(null);

    // 1. เตรียมข้อมูลให้ตรงกับที่ API ต้องการ
    const payload = {
      title: postData.title,
      description: postData.details, // แปลง details -> description
      tags: postData.subjects,     // แปลง subjects -> tags
      post_image: null,
    };

    try {
      // 2. เรียก API (อย่าลืมแก้ URL ถ้า Backend อยู่คนละที่)
      const response = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer YOUR_AUTH_TOKEN` // ถ้า API ต้องการ Token
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const responseData: ApiResponse = await response.json();
      return responseData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      throw new Error(errorMessage); // ส่ง Error ออกไปให้ Component จัดการต่อ
    } finally {
      setIsCreating(false);
    }
  };

  return { createPost, isCreating, error };
};