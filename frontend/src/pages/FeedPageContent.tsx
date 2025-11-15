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
import SearchComponent from "@/components/topMenu/SearchComponent";
import { slugify } from "@/utils/slugify";

interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

export default function Home() {

  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

  const { posts, setPosts, isLoading, error } = useFetchFeeds();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { user: currentUser } = useCurrentUser();

  // Saved posts (bookmarks)
  const [savePosts, setSavePosts] = useState<PostData[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const { isOpen } = useNotification();

  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const res = await fetch(`${BASE}/api/v1/notifications`, {
        method: "GET",
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          setNotificationError("Please log in to view your notifications.");
          setNotifications([]);
          return;
        }
        console.error(`Failed to load notifications: ${res.status}`);
        setNotificationError(`Failed to load notifications: ${res.status}`);
        setNotifications([]);
        return;
      }
      
      const items = Array.isArray(body.data) ? body.data : body.rows ?? [];

      const mapped: NotificationData[] = items.map((n: any) => ({
        // notification_id, notification_type, message, link, is_read, created_at
        noti_id: String(n.notification_id),
        message: n.message,
        created_at: n.created_at,
        is_read: Boolean(n.is_read),
        href: n.link || "#",
        type: n.notification_type,
      }));

      setNotifications(mapped);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const fetchSavedPosts = async () => {
    setIsLoadingSaved(true);
    setSavedError(null);
    try {
      const res = await fetch(`${BASE}/api/v1/posts/bookmarks`, {
        method: "GET",
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          setSavedError("Please log in to view your saved posts.");
          setSavePosts([]);
          return;
        }
        const msg = body?.message || `Failed to load saved posts: ${res.status}`;
        setSavedError(msg);
        setSavePosts([]);
        return;
      }

      const items = Array.isArray(body?.data) ? body.data : body?.rows ?? [];

      const mapped: PostData[] = items.map((p: any) => ({
        post_id: String(p.post_id),
        title: p.title,
        description: p.description ?? "",
        post_image: p.post_image ?? null,
        is_solved: Boolean(p.is_solved),
        created_at: p.created_at ?? "",
        author: {
          user_id: String(p.user_id),
          display_name:
            p.author.display_name ?? "Anonymous",
          profile_picture:
            p.author.profile_picture ?? "/image/DefaultAvatar.png",
        },
        tags: p.tags ?? [],
      }));

      setSavePosts(mapped);
    } catch (err: any) {
      setSavedError(err?.message ?? String(err));
      setSavePosts([]);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchSavedPosts();
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
      <div className="max-w-5xl mr-[2%]">
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
      </div>
    );
  };

  const renderSavedPost = () => {
    if (isLoadingSaved) return <p className="text-center mt-4">Loading saved posts...</p>;
    if (savedError) return <p className="text-center text-gray-500 mt-4">{savedError}</p>;
    if (savePosts.length === 0)
      return <p className="text-center mt-4">No saved posts yet. Try saving some posts to see them here.</p>;

    return (
      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold mb-4">Saved posts</h3>
        {savePosts.map((sp) => {
          const slug = slugify(sp.title || "");
          const desc = sp.description ?? "";
          const avatar = sp.author.profile_picture ?? "/image/DefaultAvatar.png";
          const authorName = sp.author.display_name ?? "Anonymous";

          return (
            <Link
              key={sp.post_id}
              href={`/post/${sp.post_id}/${slug}`}
              className="block p-3 rounded bg-accent-200/50 hover:bg-accent-200"
            >
              <h4 className="text-md font-semibold text-gray-900 truncate">{sp.title || "(Untitled)"}</h4>
              <p className="text-sm text-gray-600 mt-1 truncate">{desc}</p>
              <div className="flex items-center gap-2 mt-3">
                <img
                  src={avatar}
                  alt={`${authorName} avatar`}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/image/DefaultAvatar.png";
                  }}
                />
                <span className="text-sm font-medium text-gray-800">{authorName}</span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  const renderNotification= () => { 
    if (isLoadingNotifications) return <p className="text-center mt-4">Loading notifications...</p>;
    if (notificationError) return <p className="text-center text-gray-500 mt-4">{notificationError}</p>;
    if (notifications.length === 0) return <p className="text-center mt-4">No notifications.</p>;

    return (
      <div>
        {notifications.map((noti) => (
          <Notification key={noti.noti_id} notificationData={noti} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col font-display">

      {/* ✅ Notification Sidebar — RIGHT SIDE */}
      <aside
        className={`
          fixed top-16 right-0 h-full border-l p-2 transition-transform duration-300 bg-white w-[20%] max-w-xl
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <h2 className="text-2xl font-bold mb-6 mt-5 ml-4">Notifications</h2>
        {renderNotification()}
      </aside>

      {/* FEED CONTENT (SHIFT LEFT WHEN OPEN) */}
      <div className ="flex flex-row">
        <div className ="flex flex-col w-[25%] max-w-xl mt-10 pl-[1%] pr-[2%] font-display">
          <SearchComponent />
          {renderSavedPost()}
        </div>

        <main 
          className={`flex flex-1 items-start flex-col mb-10 transition-all duration-300 ${
            isOpen ? "mr-[20%]" : ""
          }`}
        >
          <h1 className="text-5xl font-bold p-4 mb-2">Recent Posts</h1>
          {renderContent()}
        </main>
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