"use client";

import { useEffect, useState } from 'react'

type Author = {
  display_name: string
  profile_picture: string
}

type Stats = {
  likes: number
  dislikes: number
}

interface PostAuthorProps {
  postId: string
  author: Author
  stats: Stats
  liked_by_user: boolean
  disliked_by_user: boolean
}

const PostAuthor = ({
  postId,
  author,
  stats,
  liked_by_user,
  disliked_by_user,
}: PostAuthorProps) => {

  const [liked, setLiked] = useState(liked_by_user)
  const [disliked, setDisliked] = useState(disliked_by_user)
  const [likes, setLikes] = useState(stats.likes)
  const [dislikes, setDislikes] = useState(stats.dislikes)
  const [loading, setLoading] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

  // -------------------------------------------------------
  // 🔥 FIX #1 — Fetch real rating on mount AFTER REFRESH
  // -------------------------------------------------------
  useEffect(() => {
    async function fetchRealRating() {
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/ratings/summary?target_type=post&ids=${postId}`,
          { credentials: 'include' }
        );

        if (!res.ok) return;

        const json = await res.json();
        const data = json?.data?.[0];

        if (!data) return;

        // apply correct values
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setLiked(data.my_rating === "like");
        setDisliked(data.my_rating === "dislike");
      } catch (err) {
        console.error("Failed to fetch rating summary:", err);
      }
    }

    fetchRealRating();
  }, [postId]);
  // -------------------------------------------------------


  // =======================================================
  // Backend helper functions working fine, no changes below
  // =======================================================

  async function postRate(target_type: 'post' | 'comment', target_id: number | string, rating_type: 'like' | 'dislike') {
    const res = await fetch(`${API_BASE}/api/v1/ratings`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_type,
        target_id: Number(target_id),
        rating_type,
      }),
    });

    if (!res.ok) throw new Error(`POST failed ${res.status}`);
    return await res.json();
  }

  async function deleteRate(target_type: 'post' | 'comment', target_id: number | string) {
    const res = await fetch(`${API_BASE}/api/v1/ratings`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_type,
        target_id: Number(target_id),
      }),
    });

    if (!res.ok) throw new Error(`DELETE failed ${res.status}`);
    return await res.json();
  }

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    const prev = { liked, disliked, likes, dislikes };

    if (liked) {
      setLiked(false);
      setLikes((l) => Math.max(l - 1, 0));
    } else {
      setLiked(true);
      setLikes(likes + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes((d) => Math.max(d - 1, 0));
      }
    }

    try {
      const json = liked
        ? await deleteRate('post', postId)
        : await postRate('post', postId, 'like');

      const summary = json?.data?.summary ?? json?.summary;
      const rating = json?.data?.rating ?? json?.rating;

      if (summary) {
        setLikes(summary.likes);
        setDislikes(summary.dislikes);
      }

      if (rating?.rating_type) {
        setLiked(rating.rating_type === 'like');
        setDisliked(rating.rating_type === 'dislike');
      }
    } catch (err) {
      setLiked(prev.liked);
      setDisliked(prev.disliked);
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
    } finally {
      setLoading(false);
    }
  };

  const toggleDislike = async () => {
    if (loading) return;
    setLoading(true);

    const prev = { liked, disliked, likes, dislikes };

    if (disliked) {
      setDisliked(false);
      setDislikes((d) => Math.max(d - 1, 0));
    } else {
      setDisliked(true);
      setDislikes(dislikes + 1);
      if (liked) {
        setLiked(false);
        setLikes((l) => Math.max(l - 1, 0));
      }
    }

    try {
      const json = disliked
        ? await deleteRate('post', postId)
        : await postRate('post', postId, 'dislike');

      const summary = json?.data?.summary ?? json?.summary;
      const rating = json?.data?.rating ?? json?.rating;

      if (summary) {
        setLikes(summary.likes);
        setDislikes(summary.dislikes);
      }

      if (rating?.rating_type) {
        setLiked(rating.rating_type === 'like');
        setDisliked(rating.rating_type === 'dislike');
      }
    } catch (err) {
      setLiked(prev.liked);
      setDisliked(prev.disliked);
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={author.profile_picture || "/image/DefaultAvatar.png"}
          alt={author.display_name}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-dark-900">
          {author.display_name}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Like */}
        <div className="flex items-center gap-2 text-gray-600">
          <button
            onClick={(e) => { e.stopPropagation(); toggleLike(); }}
            disabled={loading}
            aria-pressed={liked}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors disabled:opacity-60"
          >
            <svg
              className={`w-5 h-5 ${liked ? 'text-dark-900 fill-dark-900' : 'text-dark-900'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z" />
            </svg>
          </button>
          <span className="font-bold">{likes}</span>
        </div>

        {/* Dislike */}
        <div className="flex items-center gap-2 text-gray-600">
          <button
            onClick={(e) => { e.stopPropagation(); toggleDislike(); }}
            disabled={loading}
            aria-pressed={disliked}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors disabled:opacity-60"
          >
            <svg
              className={`w-5 h-5 ${disliked ? 'text-dark-900 fill-dark-900' : 'text-dark-900'}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={disliked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 14V2" />
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" />
            </svg>
          </button>
          <span className="font-bold">{dislikes}</span>
        </div>

        
      </div>
    </div>
  )
}

export default PostAuthor;