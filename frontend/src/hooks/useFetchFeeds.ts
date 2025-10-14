import { useState, useEffect } from 'react';
import { PostData } from '@/components/post/Post';

// 1. กำหนด Type ของข้อมูลดิบที่ได้จาก API ใหม่ให้ตรงเป๊ะ
interface RawFeedData {
  post_id: string;
  title: string;
  description: string;
  post_image: string | null;
  is_solved: boolean;
  created_at: string;
  // ข้อมูล Author และ Stats ไม่ได้ซ้อนกันมา
  user_id: string;
  display_name: string;
  profile_picture: string;
  likes: number;
  dislikes: number;
  tags: string[];
  // top_comment กลายเป็น object ที่ซ้อนอยู่
  top_comment: {
    comment_id: string;
    text: string;
    created_at: string;
    user_id: string;
    display_name: string;
    profile_picture: string;
    likes: number;
    dislikes: number;
  } | null;
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
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feeds. Please ensure you are logged in.');
        }

        const responseData = await response.json();
        
        // 2. ปรับแก้ส่วน Transformation ให้ตรงกับข้อมูลใหม่
        const transformedFeeds: PostData[] = responseData.data.map((row: RawFeedData) => {
          
          // ประกอบร่าง Top Comment (ตอนนี้ข้อมูลสมบูรณ์แล้ว)
          const topComment = row.top_comment ? {
            comment_id: row.top_comment.comment_id,
            text: row.top_comment.text,
            created_at: row.top_comment.created_at,
            likes: row.top_comment.likes,
            dislikes: row.top_comment.dislikes,
            author: { // สร้าง author object ที่ซ้อนกัน
              user_id: row.top_comment.user_id,
              display_name: row.top_comment.display_name,
              profile_picture: row.top_comment.profile_picture,
            }
          } : undefined;

          // ประกอบร่าง PostData ที่สมบูรณ์
          return {
            post_id: row.post_id,
            title: row.title,
            description: row.description,
            created_at: row.created_at,
            is_solved: row.is_solved,
            tags: row.tags,
            post_image: row.post_image || undefined,
            author: { // สร้าง author object ที่ซ้อนกัน
              user_id: row.user_id,
              display_name: row.display_name,
              profile_picture: row.profile_picture,
            },
            stats: { // สร้าง stats object ที่ซ้อนกัน
              likes: Number(row.likes), // แปลงเป็น Number เพื่อความปลอดภัย
              dislikes: Number(row.dislikes),
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
  }, []);

  return { posts, setPosts, isLoading, error };
};