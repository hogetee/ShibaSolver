"use client";

import { useState, useEffect} from "react";
import Comment from "@/components/comment/Comment";
import { CommentData } from "@/components/comment/types";
import CreateComment from "./CreateComment";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCommentActions } from "@/components/comment/useCommentActions";

interface Props {
  initialComments: CommentData[];
  postId: string;
}

export default function CommentSection({ initialComments, postId }: Props) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //current user for creating comment
  const { user: currentUser } = useCurrentUser();
  const { handleCreateNewComment } = useCommentActions("root", 0, 0, false);
  const topLevelComments = comments.filter(comment => comment.parent_comment === null);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

  const handleCommentDelete = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const handleSubmitWithRefresh = async (
    text: string,
    imageUrl?: string | null | undefined
  ) => {
    setIsSubmitting(true);

    try {
      await handleCreateNewComment(Number(postId), text, imageUrl);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const scrollPosition = window.scrollY;
      sessionStorage.setItem("scrollPosition", scrollPosition.toString());
      window.location.reload();

      console.log("Comment created and page refreshed.");
      return true;
    } catch (error) {
      console.error("Failed to create comment:", error);
      setIsSubmitting(false);
      alert("Failed to create comment. Please try again.");
      return false;
    }
  };

  return (
    <>
      {/* A section to create a new comment could go here */}
      <div className="w-full bg-white hover:shadow-2xl/15 rounded-2xl shadow-lg p-3 flex flex-col font-display mt-5">
        {/* CreateComment component */}
        <CreateComment
          placeholder="Create a new comment..."
          author={
            currentUser
              ? {
                  profile_picture: currentUser.profile_picture ?? undefined,
                  display_name: currentUser.display_name ?? undefined,
                }
              : undefined
          }
          onSubmit={handleSubmitWithRefresh}
          disabled={isSubmitting}
        />
        {isSubmitting && (
          <div className="flex items-center justify-center mt-2 text-accent-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-600 mr-2"></div>
            Creating comment...
          </div>
        )}
      </div>
      {/* The list of comments is rendered from state */}
      <div className="mt-5 pt-4 ">
        <h2 className="text-2xl font-semibold mb-4 text-dark-800 font-display">
          Comments ({topLevelComments.length})
        </h2>
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <Comment
              key={comment.id}
              commentData={comment}
              allComments={comments} // Pass all comments so Comment can filter replies
              onDelete={handleCommentDelete}
              postId={postId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
