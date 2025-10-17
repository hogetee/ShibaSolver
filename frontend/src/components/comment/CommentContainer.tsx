"use client";

import { useMemo } from "react";
import { CommentData } from "@/components/comment/types";
import CommentSection from "@/components/comment/CommentSection";
import usePostComments from "@/hooks/userPostComments";

interface Props {
  postId: string | number;
  sort?: "latest" | "popular" | "oldest" | "ratio";
}



function mapPostCommentToCommentData(api: any): CommentData {
  return {
    id: String(api.comment_id),
    author: {
      display_name: api.user_name || "Anonymous",
      profile_picture: api.profile_picture || "/assets/image/DefaultAvatar.png",
      user_id: Number(api.user_id || 0),
    },
    text: String(api.text ?? ""),
    comment_image : api.comment_image || null,
    created_at: api.created_at,
    likes: Number(api.likes ?? 0),
    dislikes: Number(api.dislikes ?? 0),
    // NOTE: The 'PostComment' type does not include a reply count.
    // This must be calculated separately on the frontend or added to the backend query.
    // For now, it is defaulted to 0.
    Replies: 0, 
    is_solution: Boolean(api.is_solution),
  };
}

export default function CommentContainer({ postId, sort = "latest" }: Props) {
  const { comments, isLoading, error, restricted, reason } = usePostComments(postId, sort);
  const mapped = useMemo<CommentData[]>(() => comments.map(mapPostCommentToCommentData), [comments]);
  

  if (isLoading) return <div className="mt-5 pt-4">Loading comments…</div>;
  if (error) return <div className="mt-5 pt-4 text-red-600">Failed to load comments: {error}</div>;
  if (restricted) {
    return (
      <div className="mt-5 pt-4 text-gray-700">
        {reason === "LOGIN_REQUIRED" && "Please log in to view comments on older posts."}
        {reason === "PREMIUM_REQUIRED" && "Upgrade to premium to view comments on older posts."}
      </div>
    );
  }

  return <CommentSection initialComments={mapped} />;
}

// async function getComment(postId: string): Promise<CommentData[]> {
//   const res = await fetch(`https://your-api.com/api/comments/${postId}`, {
//     cache: 'no-store', 
//   })

//   if (!res.ok) {
//     throw new Error('Failed to fetch post')
//   }
  

//   const data: any[] = await res.json()

//   return data.map(mapApiToCommentData)
// }




// // MOCK DATA
// const DATE_C1 = new Date(Date.now() - 1000 * 60 * 5).toISOString();
// const DATE_C2 = new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString();
// const DATE_C3 = new Date(Date.now() - 1000 * 60 * 1).toISOString();

// const MOCK_MAPPED_COMMENT_DATA: CommentData[] = [
//     {
//         id: "api_c101",
//         author: {
//             display_name: "CoderGuru_99",
//             profile_picture: "https://i.pravatar.cc/40?img=21",
//         },
//         text: "This is a fantastic explanation! The Next.js fix was spot on. 👍",
//         created_at: DATE_C1,
//         likes: 45,
//         dislikes: 0,
//         Replies: 3,
//         is_solution : true,
//     },
//     {
//         id: "api_c102",
//         author: {
//             display_name: "ReactFanatic",
//             profile_picture: "https://i.pravatar.cc/40?img=15",
//         },
//         text: "I disagree with using Client Components here. This could have been entirely server-rendered with a little more thought.",
//         created_at: DATE_C2,
//         likes: 18,
//         dislikes: 10,
//         Replies: 0,
//         is_solution : false,
//     },
//     {
//         id: "api_c103",
//         author: {
//             display_name: "NewbieDev",
//             profile_picture: "https://i.pravatar.cc/40?img=50",
//         },
//         text: "First time here. Love this community!",
//         created_at: DATE_C3,
//         likes: 0, // Mapped from missing fields using || 0
//         dislikes: 0, // Mapped from missing fields using || 0
//         Replies: 0, // Mapped from missing fields using || 0
//         is_solution : false,
//     },
// ];



// export default async function CommentPostPage({ postId }: Props) {



//   // For a real app
//   // const initialComments = await getComment(postId); 

//   const initialComments = MOCK_MAPPED_COMMENT_DATA; // Using mock data for now

//   return (
//     <div className="min-h-screen  flex flex-col font-display mt-10 ">
      

//           <CommentSection initialComments={initialComments} />
     
//     </div>
//   );
// }










// async function getCommentData(postId: string): Promise<CommentData[]> {
//   // This is mock data and doesn't depend on postId, but in a real app it would.
//   return [
//     {
//       id: "c1",
//       author: { display_name: "Alice Johnson", profile_picture: "https://i.pravatar.cc/40?img=1" },
//       text: "This is the first comment! 🚀",
//       created_at: new Date().toISOString(),
//       likes: 12,
//       dislikes: 1,
//       Replies: 2,
//     },
//     {
//       id: "c2",
//       author: { display_name: "Bob Smith", profile_picture: "https://i.pravatar.cc/40?img=2" },
//       text: "I totally agree with this post 🙌",
//       created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
//       likes: 8,
//       dislikes: 0,
//       Replies: 1,
//     },
//     {
//       id: "c3",
//       author: { display_name: "Charlie Brown", profile_picture: "https://i.pravatar.cc/40?img=3" },
//       text: "Hmm, I’m not so sure about this… 🤔",
//       created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
//       likes: 3,
//       dislikes: 5,
//       Replies: 0,
//     },
//   ];
// }
// You can use the exact date strings from the mock API response for accurate comparison in tests.



// export default async function CommentPostPage({ postId }: Props) {
//   const [comments, setComments] = useState<CommentData[]>([]);
//   // State to handle loading status
//   const [isLoading, setIsLoading] = useState(true);


//   useEffect(() => {
//     // Define an async function to fetch all necessary data
//     const fetchAllData = async () => {
//       try {
//         setIsLoading(true); // Set loading to true before fetching
//         // Fetch post and comments data concurrently
//         // const [commentsData] = await Promise.all([
//         //   getComment(postId)
//         // ]);

//         // MOCK DATA *****

//         const commentsData = MOCK_MAPPED_COMMENT_DATA

//         setComments(commentsData);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         // Optionally, set an error state here to show an error message
//       } finally {
//         setIsLoading(false); // Set loading to false after fetching is complete
//       }
//     };

//     fetchAllData();
//   }, [postId]); 

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-xl">Loading post...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col font-display mt-20 px-70">
//       <div className="flex flex-1">
//         <main className="flex-1 p-5">
//             {/* Create Comment Section */}

//             {/* Comments Section */}
//             <div className="mt-8 pt-4 border-t border-gray-200">
//                 <h2 className="text-2xl font-semibold mb-4 text-dark-800">
//                 Comments ({comments.length})
//                 </h2>
//                 <div className="space-y-4">
//                 {comments.map((comment) => (
//                     <Comment key={comment.id} commentData={comment} />
//                 ))}
//                 </div>
//             </div>
//         </main>
//       </div>
//     </div>
//   );
// }