'use client';

import { useState } from 'react';

type Author = {
  display_name: string;
  profile_picture: string;
};

type Stats = {
  likes: number;
  dislikes: number;
};

interface PostAuthorProps {
  author: Author;
  stats: Stats;
  liked_by_user: boolean;
  disliked_by_user: boolean; 
}

const PostAuthor = ({
  author,
  stats,
  liked_by_user,
  disliked_by_user,
}: PostAuthorProps) => {
  const [liked, setLiked] = useState(liked_by_user);
  const [disliked, setDisliked] = useState(disliked_by_user);
  const [likes, setLikes] = useState(stats.likes);
  const [dislikes, setDislikes] = useState(stats.dislikes);

  const toggleLike = () => {
    // remove dislike if switching to like
    if (disliked) {
      setDisliked(false);
      setDislikes(prev => prev - 1);
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => prev + (newLiked ? 1 : -1));

    // TODO: call backend API
  };

  const toggleDislike = () => {
    // remove like if switching to dislike
    if (liked) {
      setLiked(false);
      setLikes(prev => prev - 1);
    }

    const newDisliked = !disliked;
    setDisliked(newDisliked);
    setDislikes(prev => prev + (newDisliked ? 1 : -1));

    // TODO: call backend API
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img
          src={author.profile_picture}
          alt={`${author.display_name}'s avatar`}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-dark-900">
          {author.display_name}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Like Button */}
        <div className="flex items-center gap-2 text-black-500">
          <button
            onClick={toggleLike}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            <svg
              className={`w-5 h-5 cursor-pointer ${
                liked ? 'text-black-500 fill-black-500' : 'text-gray-700'
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

        {/* Dislike Button */}
        <div className="flex items-center gap-2 text-black-500">
          <button
            onClick={toggleDislike}
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
          >
            <svg
              className={`w-5 h-5 cursor-pointer ${
                disliked ? 'text-black-500 fill-black-500' : 'text-gray-700'
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
      </div>
    </div>
  );
};

export default PostAuthor;