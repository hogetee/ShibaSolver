"use client";

import Post, { PostData } from "@/components/post/Post";
import Notification, { NotificationData } from "@/components/notification/Notification";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CreatePostButton from "@/components/post/CreatePostButton";
import CreatePostModal from "@/components/post/CreatePostModal";
import { useFetchFeeds } from "@/hooks/useFetchFeeds";
import { useNotification } from "@/context/NotificationContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

async function getNotificationData(): Promise<NotificationData[]> {
  return [
    { noti_id: "1", message: "Nano liked your post", time: "2 hrs ago" },
    { noti_id: "2", message: "Nano replied: “Thanks ...”", time: "2 hrs ago" },
    { noti_id: "3", message: "Tan replied: “I agree ...”", time: "yesterday" },
  ];
}

export default function Home() {
  const { posts, setPosts, isLoading, error } = useFetchFeeds();

  const { isOpen, toggle } = useNotification();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user: currentUser } = useCurrentUser();

  useEffect(() => {
    async function fetchNotifications() {
      const data = await getNotificationData();
      setNotifications(data);
    }
    fetchNotifications();
  }, []);

  const handlePostUpdateInFeed = (updated: PostData) => {
    setPosts((current) =>
      current.map((p) => (p.post_id === updated.post_id ? updated : p))
    );
  };

  const handlePostDeleteInFeed = (deletedId: string) => {
    setPosts((current) => current.filter((p) => p.post_id !== deletedId));
  };

  const handleCreatePost = (apiResponse: ApiResponse) => {
    if (!currentUser) {
      // สั่ง reload หน้าแทน
      window.location.reload(); 
      return;
    }

    const newRawPost = apiResponse.data;

    const newPost: PostData = {
      ...newRawPost,
      tags: apiResponse.tags,
      author: {
        user_id: String(currentUser.user_id), 
        display_name: currentUser.display_name, 
        profile_picture: currentUser.profile_picture || "/image/DefaultAvatar.png", 
      },
      stats: { likes: 0, dislikes: 0 },
      liked_by_user: false,
      disliked_by_user: false,
      topComment: undefined,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const renderContent = () => {
    if (isLoading) return <p className="text-center mt-10">Loading posts...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (posts.length === 0)
      return <p className="text-center mt-10">No posts yet.</p>;

    return (
      <div className="space-y-5">
        {posts.map((post) => (
          <Post
            key={post.post_id}
            postData={post}
            onPostUpdate={handlePostUpdateInFeed}
            onPostDelete={handlePostDeleteInFeed}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col font-display">

      {/* ✅ Notification Sidebar — RIGHT SIDE */}
<aside
  className={`
    fixed top-16 right-0 h-full border-l p-2 transition-transform duration-300 bg-white
    ${isOpen ? "translate-x-0 w-[20%]" : "translate-x-full w-[20%]"}
  `}
>
  <h2 className="text-2xl font-bold mb-6 mt-5 ml-4">Notifications</h2>
  {notifications.map((noti) => (
    <Notification key={noti.noti_id} notificationData={noti} />
  ))}
</aside>

{/* FEED CONTENT (SHIFT LEFT WHEN OPEN) */}
<div
  className={`flex flex-1 transition-all duration-300 ${
    isOpen ? "mr-[20%]" : ""
  }`}
>
  <main className="flex-1 mb-10 px-[5%]">
    <h1 className="text-5xl font-bold p-4 mb-2">Recent Posts</h1>
    {renderContent()}
  </main>

  {/* Right Sidebar */}
  <aside className="w-80 mt-27 mr-5 self-start">
    <Link href="/subscribe">
      <img
        src="/image/premium-banner.png"
        className="rounded-xl shadow-md hover:shadow-lg cursor-pointer"
      />
    </Link>
  </aside>
</div>
      {/* ✅ Create Post Button & Modal */}
      <CreatePostButton onClick={() => setIsCreateModalOpen(true)} />
      {isCreateModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreateModalOpen(false)}
          onPostSubmit={handleCreatePost}
        />
      )}
    </div>
  );
}