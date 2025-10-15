import { useState } from 'react';
import { PostData } from '@/components/post/Post';
import { UpdatedPostData } from '@/components/post/EditPostModal';

// Interface สำหรับข้อมูลที่ API ตอบกลับมา
interface UpdatePostApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

// Interface สำหรับข้อมูลที่เราจะส่งไปให้ API (Payload)
// เราใช้ UpdatedPostData ที่มีอยู่แล้ว แต่เปลี่ยนชื่อ field ให้ตรงกับ API
interface UpdatePostPayload {
  title: string;
  description: string;
  is_solved: boolean;
  tags: string[];
}

export const useUpdatePost = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePost = async (
    postId: string,
    dataToUpdate: UpdatedPostData // รับข้อมูลจากฟอร์ม
  ): Promise<UpdatePostApiResponse> => {
    setIsUpdating(true);
    setError(null);

    // แปลงข้อมูลจากฟอร์มให้ตรงกับที่ API ต้องการ
    const payload: UpdatePostPayload = {
      title: dataToUpdate.title,
      description: dataToUpdate.details,
      is_solved: dataToUpdate.is_solved,
      tags: dataToUpdate.subjects,
    };

    try {
      const response = await fetch(`http://localhost:5003/api/v1/posts/${postId}`, {
        method: 'PUT',
        credentials: 'include', // สำคัญมาก! สำหรับส่ง Cookie
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        // ใช้ Error message ที่ได้จาก Backend โดยตรง
        throw new Error(responseData.message || 'Failed to update post');
      }

      return responseData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      throw err; // ส่ง Error ต่อเพื่อให้ Component ที่เรียกใช้จัดการต่อได้
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePost, isUpdating, error };
};