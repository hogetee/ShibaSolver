'use client';

import Post, { PostData } from "@/components/post/Post";
import Notification, { NotificationData } from "@/components/notification/Notification";
import Link from 'next/link';
import React, {useEffect, useState} from "react";
import { Notifications } from '@mui/icons-material';

// ใน sprint ถัดๆไป ส่วนนี้จะเป็นการ fetch จาก API 
async function getPostData(): Promise<PostData[]> {
  const mockData: PostData[] = [
    {
      post_id: "post-001",
      title: "How to solve these chemical equations",
      description: "I need help with these chemical equations. I'm stuck on balancing the atoms.",
      is_solved: true,
      created_at: new Date().toISOString(),
      tags: ["Science"],
      post_image: "/image/mock-chemical-equation.png",
      author: {
        user_id: "Nano109",
        display_name: "Nano",
        profile_picture: "/image/DefaultAvatar.png",
      },
      stats: { likes: 12, dislikes: 4 },
      topComment: {
        comment_id: "comment-101",
        text: "This is very helpful! Remember to balance the hydrogens last.",
        created_at: new Date().toISOString(),
        likes: 15,
        dislikes: 15,
        author: {
          user_id: "user-tee",
          display_name: "Tee",
          profile_picture: "/image/DefaultAvatar.png",
        },
      },
    },
    // เพิ่มโพสต์ที่ยังไม่ถูกแก้ และไม่มีคอมเมนต์
    {
      post_id: "post-002",
      title: "What is the meaning of this sentence?",
      description: "Can anyone help me understand the grammatical structure of this complex sentence?",
      is_solved: false,
      created_at: new Date().toISOString(),
      tags: ["English"],
      post_image: "/image/mock-english-equation.jpg",
      author: {
        user_id: "user-tangent",
        display_name: "Tangent",
        profile_picture: "/image/DefaultAvatar.png",
      },
      stats: { likes: 5, dislikes: 0 },
      topComment: undefined, // ไม่มี Top comment
    },
    // เพิ่มโพสต์ที่ยังไม่ถูกแก้ และไม่มีคอมเมนต์
    {
      post_id: "post-003",
      title: "How to solve this hard equation?",
      description: "Can anyone help me understand how to solve this please (x^2 + 5x + 6 = 0)?",
      is_solved: true,
      created_at: new Date().toISOString(),
      tags: ["Math"],
      author: {
        user_id: "user-tangent",
        display_name: "Tangent",
        profile_picture: "/image/DefaultAvatar.png",
      },
      stats: { likes: 5, dislikes: 0 },
      topComment: {
        comment_id: "comment-501",
        text: "Thank you so much",
        created_at: new Date().toISOString(),
        likes: 9999,
        dislikes: 2215,
        author: {
          user_id: "user-best",
          display_name: "Best",
          profile_picture: "/image/DefaultAvatar.png",
        },
      },
    },
  ];
  return mockData;
}

async function getNotificationData(): Promise<NotificationData[]> {
  const mockData: NotificationData[] = [
    { 
      noti_id: "1",
      message: "Nano liked your post", 
      time: "2 hrs ago" 
    },
    {
        noti_id: "2",
        message: "Nano replied: “Thanks ...”",
        time: "2 hrs ago"
    },
    {
        noti_id: "3",
        message: "Tan replied: “I agree ...”",
        time: "yesterday"
    },
  ];
  return mockData;
}

export default function Home() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // const posts = await getPostData();
  // const notifications = await getNotificationData();
  useEffect(() => {
    async function fetchData() {
      const postsData = await getPostData();
      const notificationsData = await getNotificationData();
      setPosts(postsData);
      setNotifications(notificationsData);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-display">
        
      {/* Notification toggle Button */}
      <button
        style={{ left: showNotifications ? 'calc(20% + 8px)' : '8px' }}
        className={`fixed top-20 z-50 text-white rounded-full p-2 cursor-pointer transition-all duration-300
          ${showNotifications ? "bg-accent-600/70" : "bg-accent-600"} hover:bg-accent-600/85`}
        onClick={() => setShowNotifications((prev) => !prev)}
        aria-label="Toggle notifications"
      >
        <Notifications />
      </button>

      {/* Notifications */}
      <aside className={`fixed top-16 h-full border-r p-2 transition-transform duration-300 ${
        showNotifications ? "translate-x-0 w-[20%] max-w-320" : "-translate-x-full w-[20%] max-w-xs"}`}>
        <h2 className="text-2xl font-bold mb-6 mt-5 ml-4 text-dark-900">
            Notifications
        </h2>
        {notifications.map((notification) => (
            <Notification key={notification.noti_id} notificationData={notification} />
        ))}
      </aside>

      {/* Feed content */}
      <div className={`flex flex-1 transition-all duration-300 ${showNotifications ? "ml-[20%]" : ""}`}>
        {/* Posts */}
        <main className="flex-1 mb-10 px-[5%]">
          <h1 className="text-5xl font-bold p-4 mb-2 text-dark-900">
            Recent Posts
          </h1>
          <div className="space-y-5">
            {posts.map((post) => (
              <Post key={post.post_id} postData={post} />
            ))}
          </div>
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
    </div>
  );
}
