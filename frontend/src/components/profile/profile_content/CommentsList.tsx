"use client";
import Comment from "@/components/comment/Comment";
import { CommentData } from "@/components/comment/types";
import useUserComments from "@/hooks/useUserComments";
import Pagination from "./Pagination";
import ProfileComment from "./ProfileComment";

export default function CommentsList({ username }: { username?: string }) {
  const {
    comments,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalComments,
    setPage,
    refetch,
  } = useUserComments(username);

  console.log("CommentsList Debug:", { username, comments, isLoading, error });

  const handleCommentUpdate = (updateComment: CommentData) => {
    // You could update the local state here if needed
    // For now, we'll just refetch to ensure consistency
    refetch();
  };

  const handleCommentDelete = (commentId: string) => {
    // Refetch the comments to update the list
    refetch();
  };

  if (!username) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[280px]">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-yellow-400 text-lg">No username provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg min-h-[289px]">
      {isLoading || !comments ? (
        <div className="flex flex-col gap-4" >
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full min-h-[12rem] bg-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-1/2 mb-3" />
              <div className="h-4 bg-white/20 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col gap-2 justify-center items-center h-32">
          <p className="text-red-400 text-lg mb-2">Error loading comments</p>
          <p className="text-red-400 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : comments && comments.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-white text-xl">No comments available.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4" >
          {comments?.map((c) => (
            <div key={c.id || `comment-${c.created_at}-${c.text?.substring(0, 10)}`} className="bg-white rounded-lg p-4 text-white">
              <ProfileComment
                commentData={c}
                onDelete={handleCommentDelete}
              />
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-2 mb-1"
        />
      )}
    </div>
  );
}
