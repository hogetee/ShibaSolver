'use client';

import Post, { PostData } from "@/components/post/Post";
import Notification, { NotificationData } from "@/components/notification/Notification";
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { Notifications } from '@mui/icons-material';

import CreatePostButton from '@/components/post/CreatePostButton';
import CreatePostModal from '@/components/post/CreatePostModal';
import { useFetchFeeds } from "@/hooks/useFetchFeeds"; // 1. ใช้ Hook นี้เป็นหลัก

// Type สำหรับ Response จาก API (ใช้ใน handleCreatePost)
interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

// ฟังก์ชัน Mock สำหรับ Notifications (ยังคงไว้เหมือนเดิม)
async function getNotificationData(): Promise<NotificationData[]> {
  const mockData: NotificationData[] = [
    { noti_id: "1", message: "Nano liked your post", time: "2 hrs ago" },
    { noti_id: "2", message: "Nano replied: “Thanks ...”", time: "2 hrs ago" },
    { noti_id: "3", message: "Tan replied: “I agree ...”", time: "yesterday" },
  ];
  return mockData;
}

export default function Home() {
  // 2. เรียกใช้ Hook เพื่อดึงข้อมูลโพสต์ทั้งหมดจาก API จริง
  const { posts, setPosts, isLoading, error } = useFetchFeeds();

  // State สำหรับส่วนที่ไม่เกี่ยวกับ Posts
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. สร้าง "คู่มือ" หรือฟังก์ชันสำหรับจัดการการอัปเดต
  const handlePostUpdateInFeed = (updatedPost: PostData) => {
    setPosts(currentPosts => 
      currentPosts.map(p => 
        p.post_id === updatedPost.post_id ? updatedPost : p
      )
    );
  };

  // 2. สร้าง "คู่มือ" สำหรับการลบ (เผื่อไว้ในอนาคต)
  const handlePostDeleteInFeed = (postIdToDelete: string) => {
    setPosts(currentPosts => 
      currentPosts.filter(p => p.post_id !== postIdToDelete)
    );
  };

  // ใช้ useEffect สำหรับดึงข้อมูล Notifications แยกต่างหาก
  useEffect(() => {
    async function fetchNotifications() {
      const notificationsData = await getNotificationData();
      setNotifications(notificationsData);
    }
    fetchNotifications();
  }, []); // ทำงานแค่ครั้งแรกครั้งเดียว

  // ฟังก์ชันสำหรับ "ประกอบร่าง" โพสต์ใหม่ที่สมบูรณ์
  const handleCreatePost = (apiResponse: ApiResponse) => {
    const newPost: PostData = {
      ...apiResponse.data,
      tags: apiResponse.tags,
      author: { // ควรดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่มาใส่
        user_id: "current-user-id", // Placeholder
        display_name: "Me",         // Placeholder
        profile_picture: "/image/DefaultAvatar.png",
      },
      stats: { likes: 0, dislikes: 0 },
      topComment: undefined,
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // ฟังก์ชันสำหรับ Render ส่วนของ Feed
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500 mt-10">Loading posts...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
    }
    if (posts.length === 0) {
      return <p className="text-center text-gray-500 mt-10">No posts found. Create one!</p>;
    }
    return (
      <div className="space-y-5">
        {posts.map((post) => (
          <Post key={post.post_id} 
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
      
      {/* Notification toggle Button */}
      <button
        style={{ left: showNotifications ? 'calc(20% + 8px)' : '8px' }}
        className={`fixed top-20 z-50 text-white rounded-full p-2 cursor-pointer transition-all duration-300 ${showNotifications ? "bg-accent-600/70" : "bg-accent-600"} hover:bg-accent-600/85`}
        onClick={() => setShowNotifications((prev) => !prev)}
        aria-label="Toggle notifications"
      >
        <Notifications />
      </button>

      {/* Notifications */}
      <aside className={`fixed top-16 h-full border-r p-2 transition-transform duration-300 ${showNotifications ? "translate-x-0 w-[20%] max-w-320" : "-translate-x-full w-[20%] max-w-xs"}`}>
        <h2 className="text-2xl font-bold mb-6 mt-5 ml-4 text-dark-900">
          Notifications
        </h2>
        {notifications.map((notification) => (
          <Notification key={notification.noti_id} notificationData={notification} />
        ))}
      </aside>

      {/* Feed content */}
      <div className={`flex flex-1 transition-all duration-300 ${showNotifications ? "ml-[20%]" : ""}`}>
        <main className="flex-1 mb-10 px-[5%]">
          <h1 className="text-5xl font-bold p-4 mb-2 text-dark-900">
            Recent Posts
          </h1>
          {renderContent()}
        </main>
        
        {/* Premium Sidebar */}
        <aside className="w-80 mt-27 mr-5 self-start">
          <Link href="/subscribe" className="block rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl/15">
            <img
              src="/image/premium-banner.png"
              alt="Get Premium - 20% off"
              className="w-full h-auto rounded-xl cursor-pointer"
            />
          </Link>
        </aside>
      </div>
      
      {/* ปุ่ม และ Modal สำหรับสร้างโพสต์ */}
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