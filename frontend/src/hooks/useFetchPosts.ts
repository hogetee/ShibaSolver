import { useState, useEffect } from 'react';
import { PostData } from '@/components/post/Post';

// สมมติว่า API ตอบกลับมาในรูปแบบนี้
interface ApiResponse {
  success: boolean;
  data: PostData[];
}

export const useFetchPosts = () => {
  // State สำหรับเก็บข้อมูล, สถานะ loading, และ error
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // เริ่มต้นด้วย true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // --- ในอนาคตจะเปลี่ยนเป็น /api/v1/posts ---
        // const response = await fetch('/api/v1/posts'); 
        
        // --- ตอนนี้ใช้ Mock Data ไปก่อน ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // จำลองการรอ
        const mockData: PostData[] = [
          {
            post_id: "post-001",
            title: "How to solve these chemical equations",
            description: "I need help with these chemical equations...",
            is_solved: true,
            created_at: new Date().toISOString(),
            tags: ["Chemistry"],
            author: { user_id: "Nano109", display_name: "Nano", profile_picture: "/image/DefaultAvatar.png" },
            stats: { likes: 12, dislikes: 4 },
            topComment: undefined
          }
        ];
        // -----------------------------

        // if (!response.ok) {
        //   throw new Error('Failed to fetch posts');
        // }
        // const responseData: ApiResponse = await response.json();
        
        setPosts(mockData); // หรือ responseData.data ในอนาคต

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // `[]` หมายถึงให้ทำงานแค่ครั้งแรกครั้งเดียว

  // ส่งค่าและฟังก์ชันสำหรับอัปเดตออกไปให้ Component ใช้
  return { posts, setPosts, isLoading, error };
};