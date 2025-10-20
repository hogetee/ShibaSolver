import { useState } from 'react';

interface DeleteApiResponse {
  success: boolean;
  message: string;
  data?: {
    post_id: number;
  };
}

export const useDeletePost = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePost = async (postId: string): Promise<DeleteApiResponse> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5003/api/v1/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // สำคัญมาก! สำหรับส่ง Cookie ยืนยันตัวตน
      });

      const responseData = await response.json();
      if (!response.ok) {
        // ใช้ Error message ที่ได้จาก Backend โดยตรง
        throw new Error(responseData.message || 'Failed to delete post');
      }

      return responseData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      throw err; // ส่ง Error ต่อเพื่อให้ Component ที่เรียกใช้จัดการต่อได้
    } finally {
      setIsDeleting(false);
    }
  };

  return { deletePost, isDeleting, error };
};