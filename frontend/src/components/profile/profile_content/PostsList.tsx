import Post from "../../post/Post";
import { PostData } from "../../post/Post";

async function getFeedData(): Promise<PostData[]> {
  const mockData: PostData[] = [
    {
      post_id: "post-001",
      title: "How to solve these chemical equations",
      description: "I need help with these chemical equations. I'm stuck on balancing the atoms.",
      is_solved: true,
      created_at: new Date().toISOString(),
      tags: ["Science"],
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
      title: "What is the meaning of this sentence?",
      description: "Can anyone help me understand the grammatical structure of this complex sentence?",
      is_solved: false,
      created_at: new Date().toISOString(),
      tags: ["English"],
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
      post_id: "post-004",
      title: "What is the meaning of this sentence?",
      description: "Can anyone help me understand the grammatical structure of this complex sentence?",
      is_solved: false,
      created_at: new Date().toISOString(),
      tags: ["English"],
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
      post_id: "post-005",
      title: "What is the meaning of this sentence?",
      description: "Can anyone help me understand the grammatical structure of this complex sentence?",
      is_solved: false,
      created_at: new Date().toISOString(),
      tags: ["English"],
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
      post_id: "post-006",
      title: "What is the meaning of this sentence?",
      description: "Can anyone help me understand the grammatical structure of this complex sentence?",
      is_solved: false,
      created_at: new Date().toISOString(),
      tags: ["English"],
      author: {
        user_id: "user-tangent",
        display_name: "Tangent",
        profile_picture: "/image/DefaultAvatar.png",
      },
      stats: { likes: 5, dislikes: 0 },
      topComment: undefined, // ไม่มี Top comment
    }
  ];
  return mockData;
}

export default async function PostsList() {
    const posts = await getFeedData();
    
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center w-full gap-6">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-white text-lg">No posts available.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.post_id} className="w-full">
              <Post postData={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
