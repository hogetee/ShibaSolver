"use client";
import { useRouter } from "next/navigation";
import { SolutionTag } from "@/components/comment/SolutionTag";
import { formatTimeAgo } from "@/components/comment/utils";
import CommentContentDisplay from "@/components/comment/CommentContent";
import { CommentContent } from "@/components/comment/types";
import { LikeButton } from "@/components/comment/LikeButton";
import { DislikeButton } from "@/components/comment/DislikeButton";
import { useCommentActions } from "@/components/comment/useCommentActions";

export interface profileCommentData {
  id: string;
  post_id: string;
  post_title: string;
  author: {
    user_id: number;
    display_name?: string | null;
    profile_picture: string;
  };
  text: string;
  created_at: string; // ISO date
  comment_image?: string | undefined;
  likes: number;
  dislikes: number;
  replies: number;
  is_solution: boolean;
  is_updated?: string; // ISO date, optional
  // parent_comment?: string | null; // ID of parent comment if this is a reply
  // replies?: CommentData[]; // Array of nested replies (populated by frontend)
}

interface ProfileCommentProps {
  commentData: profileCommentData;
  onDelete?: (commentId: string) => void;
}

export default function ProfileComment({
  commentData,
  onDelete,
}: ProfileCommentProps) {
  const router = useRouter();

  const handlePostClick = () => {
    if (commentData.post_id) {
      router.push(`/posts/${commentData.post_id}`);
    }
  };

  const content = {
    text: commentData.text,
    image: commentData.comment_image,
  };

  const {
    likes,
    dislikes,
    userLikeStatus,
    toggleLike,
    toggleDislike,
  } = useCommentActions(
    commentData.id,
    commentData.likes,
    commentData.dislikes,
    commentData.is_solution,
    onDelete,
    "none",
    content
  );

  return (
    <div>
      <div className="flex items-start gap-3 relative font-display">
        <img
          src={commentData.author.profile_picture}
          alt={`${commentData.author.display_name}'s avatar`}
          className="w-10 h-10 rounded-full"
          onError={(e) => {
            e.currentTarget.src = "/image/DefaultAvatar.png";
          }}
        />

        <div className="flex-grow">
          {/* Header and Text Content */}
          <div className="flex items-start justify-between">
            <div className="flex items-baseline  gap-3">
              <span
                className="font-semibold text-xl"
                style={{ color: "var(--color-dark-900)" }}
              >
                {commentData.post_title}
              </span>
              <span className="text-base text-gray-400">
                {formatTimeAgo(commentData.created_at)}
              </span>
              {commentData.is_updated ? (
                <span className="text-base text-gray-400 italic">[Edited]</span>
              ) : null}
            </div>
            <div
              className={`transition-all duration-300 ease-in-out transform ${
                commentData.is_solution
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              <SolutionTag />
            </div>
          </div>
          <CommentContentDisplay content={content} />
          <div className="flex items-center gap-3 text-gray-500">
            {/* 1. Like Button */}
            <LikeButton
              count={likes}
              userStatus={userLikeStatus}
              onClick={toggleLike}
            />

            {/* 2. Dislike Button */}
            <DislikeButton
              count={dislikes}
              userStatus={userLikeStatus}
              onClick={toggleDislike}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
