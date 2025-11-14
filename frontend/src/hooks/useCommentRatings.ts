import { useState, useEffect } from 'react';
import { CommentData } from '@/components/comment/types';
import { profileCommentData } from '@/components/profile/profile_content/ProfileComment';

export default function useCommentRatings(comments: profileCommentData[] | null) {
  const [commentRatings, setCommentRatings] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!comments || comments.length === 0) {
        setCommentRatings({});
        return;
      }

      setIsLoadingRatings(true);
      const ratings: Record<string, 'like' | 'dislike' | null> = {};
      
      await Promise.all(
        comments.map(async (comment) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ratings/check?target_type=comment&target_id=${comment.comment_id}`,
              { credentials: 'include' }
            );

            // console.log(`Fetched rating for comment ${comment.comment_id}:`, response);
            
            if (response.ok) {
              const data = await response.json();
              ratings[comment.comment_id] = data.my_rating;
            } else {
              ratings[comment.comment_id] = null;
            }
          } catch (err) {
            console.error(`Failed to fetch rating for comment ${comment.comment_id}:`, err);
            ratings[comment.comment_id] = null;
          }
        })
      );

      setCommentRatings(ratings);
      setIsLoadingRatings(false);
    };

    fetchRatings();
  }, [comments]);

  // console.log("useCommentRatings Debug:", { commentRatings, isLoadingRatings });

  return { commentRatings, isLoadingRatings };
}