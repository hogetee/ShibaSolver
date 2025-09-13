import Image from "next/image";
import Link from "next/link";
import Post, { PostData } from "@/components/post/Post";

// ใน sprint ถัดๆไป ส่วนนี้จะเป็นการ fetch จาก API 
async function getFeedData(): Promise<PostData[]> {
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

export default async function Home() {

  const posts = await getFeedData();
  return (
    <main className="min-h-screen w-full bg-gray-100 p-4 flex flex-col items-center gap-6">
      <div className="w-full max-w-3xl flex justify-end">
        <Link
          href="/user/edit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
        >
          Edit Profile
        </Link>
      </div>
      {posts.map(post => (
        <Post key={post.post_id} postData={post} />
      ))}
    </main>
  );
}
