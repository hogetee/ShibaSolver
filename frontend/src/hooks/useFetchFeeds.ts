import { useState, useEffect } from 'react';
import { PostData } from '@/components/post/Post';

// กำหนด Type ของข้อมูลดิบที่ได้จาก API (ตรงกับ SQL query)
interface RawFeedData {
  post_id: string;
  title: string;
  description: string;
  post_created_at: string;
  comment_id: string | null;
  top_comment_text: string | null;
  comment_created_at: string | null;
  total_ratings: number;
  // 🚨 ข้อมูลที่ขาดหายไปจาก API: author, post stats, tags
}

export const useFetchFeeds = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5003/api/v1/feeds', {
          method: 'GET',
          credentials: 'include', // สำคัญมาก! สำหรับ Private route
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feeds. Please ensure you are logged in.');
        }

        const responseData = await response.json();
        
        // --- 🪄 การแปลงข้อมูล (Transformation) ---
        // แปลงข้อมูลดิบ (flat) ที่ได้จาก API ให้เป็นโครงสร้าง PostData (nested)
        const transformedFeeds: PostData[] = responseData.rows.map((row: RawFeedData) => {
          
          // ประกอบร่าง Top Comment (ถ้ามี)
          const topComment = row.comment_id ? {
            comment_id: row.comment_id,
            text: row.top_comment_text || '',
            created_at: row.comment_created_at || '',
            likes: row.total_ratings, // API ส่งมาเป็น total_ratings
            dislikes: 0, // 🚨 API ไม่ได้ส่ง dislikes มา
            author: { // 🚨 API ไม่ได้ส่ง author ของ comment มา, ต้องใช้ข้อมูลจำลอง
              user_id: "comment-author-mock",
              display_name: "Top Commenter",
              profile_picture: "/image/DefaultAvatar.png",
            }
          } : undefined;

          // ประกอบร่าง PostData ที่สมบูรณ์
          return {
            post_id: row.post_id,
            title: row.title,
            description: row.description,
            created_at: row.post_created_at,
            is_solved: false, // 🚨 API ไม่ได้ส่ง is_solved มา
            tags: ["Mock Tag"], // 🚨 API ไม่ได้ส่ง tags มา
            post_image: undefined, // 🚨 API ไม่ได้ส่ง post_image มา
            author: { // 🚨 API ไม่ได้ส่ง author ของ post มา, ต้องใช้ข้อมูลจำลอง
              user_id: "post-author-mock",
              display_name: "Post Author",
              profile_picture: "/image/DefaultAvatar.png",
            },
            stats: { // 🚨 API ไม่ได้ส่ง stats ของ post มา
              likes: 0,
              dislikes: 0,
            },
            topComment: topComment,
          };
        });

        setPosts(transformedFeeds);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeds();
  }, []); // `[]` หมายถึงให้ทำงานแค่ครั้งแรกครั้งเดียว

  // ส่งค่าและฟังก์ชัน setPosts ออกไปให้ Component ใช้
  return { posts, setPosts, isLoading, error };
};