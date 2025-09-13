import Post, { PostData } from "@/components/post/Post";
import Notification, { NotificationData } from "@/components/notification/Notification";

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
        display_name: "NanoBigDick",
        profile_picture: "/image/DefaultAvatar.png",
      },
      stats: { likes: 12, dislikes: 4 },
      topComment: {
        comment_id: "comment-101",
        text: "This is very helpful! Remember to balance the hydrogens last.",
        created_at: new Date().toISOString(),
        likes: 15,
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

export default async function Home() {

  const posts = await getPostData();
  const notifications = await getNotificationData();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* Feed content */}
        <div className="flex flex-1">
            {/* Notifications */}
            <aside className="w-[20%] bg-white border-r p-2 flex flex-col">
            <h2 className="text-lg font-bold mb-6">
                Notifications
            </h2>
            {notifications.map((notification) => (
                <Notification key={notification.noti_id} notificationData={notification} />
            ))}
            </aside>

        {/* Posts */}
        <main className="flex-1 p-5">
          <h1 className="text-3xl font-bold p-4 mb-2">
            Recent Posts
          </h1>
          <div className="space-y-5">
            {posts.map((post) => (
              <Post key={post.post_id} postData={post} />
            ))}
          </div>
        </main>

        {/* Premium Sidebar */}
        <aside className="w-80 bg-white border-1 p-8 flex flex-col items-center rounded-xl shadow-md mt-5 mr-5 h-fit self-start">
          <h2 className="text-2xl font-bold mb-2">
            Get Premium
          </h2>
          <p className="text-4xl font-extrabold text-purple-400 mb-4">
            20% off
          </p>
          <button className="bg-white border-2 border-purple-300 text-purple-800 px-6 py-2 rounded-lg shadow font-bold">
            Subscribe
          </button>
        </aside>
      </div>
    </div>
  );
}
