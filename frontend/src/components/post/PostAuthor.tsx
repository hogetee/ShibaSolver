'use client'

import { useState } from 'react'

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

  // ---- Helper: POST like/dislike ----
  async function postRate(
    target_type: 'post' | 'comment',
    target_id: number | string,
    rating_type: 'like' | 'dislike'
  ) {
    try {
      const res = await fetch('http://localhost:5003/api/v1/ratings', {
        method: 'POST',
        credentials: 'include', // ✅ include cookies for auth
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type,
          target_id: Number(target_id),
          rating_type,
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          console.warn('User not authenticated')
        }
        throw new Error(`POST /ratings failed: ${res.status}`)
      }

      return await res.json()
    } catch (err) {
      console.error('Error posting rating:', err)
      throw err
    }
  }

  // ---- Helper: DELETE rating ----
  async function deleteRate(
    target_type: 'post' | 'comment',
    target_id: number | string
  ) {
    try {
      const res = await fetch('http://localhost:5003/api/v1/ratings', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type,
          target_id: Number(target_id),
        }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          console.warn('User not authenticated')
        }
        throw new Error(`DELETE /ratings failed: ${res.status}`)
      }

      return await res.json()
    } catch (err) {
      console.error('Error deleting rating:', err)
      throw err
    }
  }

  // ---- Optimistic Like Toggle ----
  const toggleLike = async () => {
    if (loading) return
    setLoading(true)

    const prev = { liked, disliked, likes, dislikes }

    // optimistic UI update
    if (liked) {
      setLiked(false)
      setLikes((l) => Math.max(0, l - 1))
    } else {
      setLiked(true)
      setLikes((l) => l + 1)
      if (disliked) {
        setDisliked(false)
        setDislikes((d) => Math.max(0, d - 1))
      }
    }

    try {
      const json = liked
        ? await deleteRate('post', postId)
        : await postRate('post', postId, 'like')

      const summary = json?.data?.summary ?? json?.summary
      const rating = json?.data?.rating ?? json?.rating
      const my_rating = rating?.rating_type ?? json?.data?.my_rating

      if (summary) {
        setLikes(Number(summary.likes))
        setDislikes(Number(summary.dislikes))
      }

      if (my_rating) {
        setLiked(my_rating === 'like')
        setDisliked(my_rating === 'dislike')
      }
    } catch (err) {
      console.error('Like action failed:', err)
      setLiked(prev.liked)
      setDisliked(prev.disliked)
      setLikes(prev.likes)
      setDislikes(prev.dislikes)
    } finally {
      setLoading(false)
    }
  }

  // ---- Optimistic Dislike Toggle ----
  const toggleDislike = async () => {
    if (loading) return
    setLoading(true)

    const prev = { liked, disliked, likes, dislikes }

    // optimistic UI update
    if (disliked) {
      setDisliked(false)
      setDislikes((d) => Math.max(0, d - 1))
    } else {
      setDisliked(true)
      setDislikes((d) => d + 1)
      if (liked) {
        setLiked(false)
        setLikes((l) => Math.max(0, l - 1))
      }
    }

    try {
      const json = disliked
        ? await deleteRate('post', postId)
        : await postRate('post', postId, 'dislike')

      const summary = json?.data?.summary ?? json?.summary
      const rating = json?.data?.rating ?? json?.rating
      const my_rating = rating?.rating_type ?? json?.data?.my_rating

      if (summary) {
        setLikes(Number(summary.likes))
        setDislikes(Number(summary.dislikes))
      }

      if (my_rating) {
        setLiked(my_rating === 'like')
        setDisliked(my_rating === 'dislike')
      }
    } catch (err) {
      console.error('Dislike action failed:', err)
      setLiked(prev.liked)
      setDisliked(prev.disliked)
      setLikes(prev.likes)
      setDislikes(prev.dislikes)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-between items-center">
      {/* --- Author Info --- */}
      <div className="flex items-center gap-3">
        <img
          src={author.profile_picture || "https://www.gravatar.com/avatar/?d=mp"}
          alt={`${author.display_name[0]}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-dark-900">
          {author.display_name}
        </span>
      </div>

      {/* --- Actions (Like, Dislike, Comment) --- */}
      <div className="flex items-center gap-4">
        {/* Like */}
        <div className="flex items-center gap-2 text-gray-600">
          <button
            onClick={(e) => {
              e.stopPropagation() // ✅ prevent navigating to post link
              toggleLike()
            }}
            disabled={loading}
            aria-pressed={liked}
            title={liked ? 'Unlike' : 'Like'}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors disabled:opacity-60"
          >
            <svg
              className={`w-5 h-5 ${
                liked ? 'text-dark-900 fill-dark-900' : 'text-dark-900'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
            onClick={(e) => {
              e.stopPropagation() // ✅ prevent navigation
              toggleDislike()
            }}
            disabled={loading}
            aria-pressed={disliked}
            title={disliked ? 'Remove dislike' : 'Dislike'}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors disabled:opacity-60"
          >
            <svg
              className={`w-5 h-5 ${
                disliked ? 'text-dark-900 fill-dark-900' : 'text-dark-900'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={disliked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 14V2" />
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" />
            </svg>
          </button>
          <span className="font-bold">{dislikes}</span>
        </div>

        {/* Comment */}
        <button className="bg-accent-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-accent-600/90 transition-colors">
          Comment
        </button>
      </div>
    </div>
  )
}

export default PostAuthor