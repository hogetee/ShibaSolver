"use client";

import useUserComments from "@/hooks/useUserComments";

export default function CommentsList({ username }: { username?: string }) {
  const { comments, isLoading, error } = useUserComments(username);

  return (
    <div className="p-4 rounded-lg min-h-[289px]">
      {isLoading ? (
        <div className="w-full">
          <div className="w-full min-h-[12rem] bg-white/10 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/2 mb-3" />
            <div className="h-4 bg-white/20 rounded w-2/3" />
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-white text-xl">No comments available.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.comment_id} className="bg-white/5 rounded-lg p-4 text-white">
              <div className="text-sm opacity-70">{c.created_at}</div>
              <div className="mt-1">{c.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
