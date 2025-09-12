"use client";

import Post from "../../post/Post";
import useUserPosts from "@/hooks/useUserPosts";

export default function PostsList({ username }: { username?: string }) {
  const { posts, isLoading, error } = useUserPosts(username);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center w-full gap-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-white text-lg">Loading posts…</p>
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
