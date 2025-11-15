import { useState, useEffect } from 'react';

export default function useCommentRating(commentId: string) {
  const [rating, setRating] = useState<'like' | 'dislike' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      if (!commentId) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ratings/check?target_type=comment&target_id=${commentId}`,
          { credentials: 'include' }
        );

        
        if (response.ok) {
          const data = await response.json();
        //   if(data.my_rating != null) console.log(`Fetched rating for comment ${commentId}:`, data);
          setRating(data.my_rating);
        } else {
          setRating(null);
        }
      } catch (err) {
        console.error(`Failed to fetch rating for comment ${commentId}:`, err);
        setRating(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();
  }, [commentId]);

  return { rating, isLoading };
}
