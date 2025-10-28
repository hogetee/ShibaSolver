"use client";

import Post, { PostData } from "@/components/post/Post";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import useUserPosts from "@/hooks/useUserPosts";
import Pagination from "./Pagination";

export default function PostsList({ username }: { username?: string }) {
  const {
    posts,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    setPage,
    refetch,
  } = useUserPosts(username);

  console.log("PostsList Debug:", { username, posts, isLoading, error });

  const handlePostUpdate = (updatedPost: PostData) => {
    // You could update the local state here if needed
    // For now, we'll just refetch to ensure consistency
    refetch();
  };

  const handlePostDelete = (postId: string) => {
    // Refetch the posts to update the list
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
    <div className="w-full max-w-4xl mx-auto min-h-[280px]">
      <div className="flex flex-col items-center w-full gap-6">
        {isLoading || !posts ? (
          <div className="w-full space-y-6">
            {/* Show multiple skeleton loaders */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full min-h-[200px] bg-white/10 rounded-2xl p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-white/20 rounded w-1/6" />
                  </div>
                </div>
                <div className="h-6 bg-white/20 rounded w-2/3 mb-3" />
                <div className="h-4 bg-white/20 rounded w-full mb-2" />
                <div className="h-4 bg-white/20 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-red-400 text-lg mb-2">Error loading posts</p>
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : posts && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-white text-lg">No posts available.</p>
          </div>
        ) : (
          posts?.map((post) => (
            <div key={post.post_id} className="w-full">
              <Post
                postData={post}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
              />
            </div>
          ))
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
    </div>
  );
}
