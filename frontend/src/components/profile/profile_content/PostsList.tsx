"use client";

import Post from "../../post/Post";
import useUserPosts from "@/hooks/useUserPosts";

export default function PostsList({ username }: { username?: string }) {
  const { posts, isLoading, error } = useUserPosts(username);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[280px]">
      <div className="flex flex-col items-center w-full gap-6">
        {isLoading ? (
          <div className="w-full">
            <div className="w-full min-h-[30vh] bg-white/10 rounded-2xl p-6 animate-pulse pb-46">
              <div className="h-6 bg-white/20 rounded w-1/3 mb-4" />
              <div className="h-4 bg-white/20 rounded w-2/3 mb-2" />
              <div className="h-4 bg-white/20 rounded w-1/2" />
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-white text-lg">No posts available.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="w-full">
              <Post postData={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
