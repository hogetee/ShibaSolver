// 'use client';

// // Import necessary React hooks and components
// import { useState, useEffect, useMemo } from 'react';
// import Post, { PostData } from "@/components/post/Post";
// import Comment from "@/components/comment/Comment";
// import { CommentData } from "@/components/comment/types";
// import usePostComments from "@/hooks/userPostComments";

// // Props for the client component
// type Props = {
//   postId: string;
// };

// // --- Data Fetching Functions ---
// // These functions can be moved to a separate 'api.ts' or 'services.ts' file
// // For this example, they remain here for clarity.

// // API call to get post data by ID
// async function getPostData(postId: string): Promise<PostData[]> {
//   // Simulating a network request with mock data
//   const mockData: PostData[] = [
//     {
//       post_id: "post-001",
//       title: "How to solve these chemical equations",
//       description: "I need help with these chemical equations. I'm stuck on balancing the atoms.",
//       is_solved: true,
//       created_at: new Date().toISOString(),
//       tags: ["Science"],
//       post_image: "/image/mock-chemical-equation.png",
//       author: {
//         user_id: "Nano109",
//         display_name: "Nano",
//         profile_picture: "/image/DefaultAvatar.png",
//       },
//       stats: { likes: 12, dislikes: 4 },
//       topComment: {
//         comment_id: "comment-101",
//         text: "This is very helpful! Remember to balance the hydrogens last.",
//         created_at: new Date().toISOString(),
//         likes: 15,
//         dislikes: 15,
//         author: {
//           user_id: "user-tee",
//           display_name: "Tee",
//           profile_picture: "/image/DefaultAvatar.png",
//         },
//       },
//     },
//   ];
//   // Filter mock data to simulate fetching a specific post
//   // return mockData.filter(p => p.post_id === postId);
//   return mockData
// }

// // Map backend PostComment rows to the UI's CommentData
// function mapPostCommentToCommentData(api: any): CommentData {
//     return {
//     id: String(api.comment_id),
//     author: {
//       display_name: api.user_name || "Anonymous",
//       profile_picture: api.profile_picture || "/assets/image/DefaultAvatar.png",
//       user_id: Number(api.user_id || 0),
//     },
//     text: String(api.text ?? ""),
//     created_at: api.created_at,
//     likes: Number(api.likes ?? 0),
//     dislikes: Number(api.dislikes ?? 0),
//     // NOTE: The 'PostComment' type does not include a reply count.
//     // This must be calculated separately on the frontend or added to the backend query.
//     // For now, it is defaulted to 0.
//     Replies: 0, 
//     is_solution: Boolean(api.is_solution),
//   };
// }

// // --- Client Component ---
// export default function PostPage({ postId }: Props) {
//   // State to hold the fetched post data
//   const [post, setPost] = useState<PostData[]>([]);
//   // Load post comments via client hook
//   const { comments, isLoading: commentsLoading, error: commentsError, restricted, reason } = usePostComments(postId, "latest");
//   const mappedComments = useMemo<CommentData[]>(() => comments.map(mapPostCommentToCommentData), [comments]);

//   // State to handle loading status for the post
//   const [isLoading, setIsLoading] = useState(true);

//   // useEffect hook to fetch post data when the component mounts or postId changes
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         setIsLoading(true);
//         const postData = await getPostData(postId);
//         setPost(postData);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [postId]);

//   // Render a loading state while post data is being fetched
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
//         {/* Main Content */}
//         <main className="flex-1 p-5">
//           <div className="space-y-5">
//             {post.map((p) => (
//               <Post key={p.post_id} postData={p} />
//             ))}
//           </div>

//           {/* Comments Section (from hook) */}
//           <div className="mt-8 pt-4 border-t border-gray-200">
//             <h2 className="text-2xl font-semibold mb-4 text-dark-800">
//               Comments ({mappedComments.length})
//             </h2>

//             {commentsLoading && <div>Loading comments…</div>}
//             {commentsError && <div className="text-red-600">Failed to load comments: {commentsError}</div>}
//             {restricted && (
//               <div className="text-gray-700">
//                 {reason === "LOGIN_REQUIRED" && "Please log in to view comments on older posts."}
//                 {reason === "PREMIUM_REQUIRED" && "Upgrade to premium to view comments on older posts."}
//               </div>
//             )}

//             {!commentsLoading && !commentsError && !restricted && (
//               <div className="space-y-4">
//                 {mappedComments.map((comment) => (
//                   <Comment key={comment.id} commentData={comment} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }







// // // Add this directive at the very top of the file
// // 'use client';

// // // Import necessary React hooks and components
// // import { useState, useEffect } from 'react';
// // import Post, { PostData } from "@/components/post/Post";
// // import Comment from "@/components/comment/Comment";
// // import { CommentData } from "@/components/comment/types";

// // // Props for the client component
// // type Props = {
// //   postId: string;
// // };

// // // --- Data Fetching Functions ---
// // // These functions can be moved to a separate 'api.ts' or 'services.ts' file
// // // For this example, they remain here for clarity.

// // // API call to get post data by ID
// // async function getPostData(postId: string): Promise<PostData[]> {
// //   // Simulating a network request with mock data
// //   const mockData: PostData[] = [
// //     {
// //       post_id: "post-001",
// //       title: "How to solve these chemical equations",
// //       description: "I need help with these chemical equations. I'm stuck on balancing the atoms.",
// //       is_solved: true,
// //       created_at: new Date().toISOString(),
// //       tags: ["Science"],
// //       post_image: "/image/mock-chemical-equation.png",
// //       author: {
// //         user_id: "Nano109",
// //         display_name: "Nano",
// //         profile_picture: "/image/DefaultAvatar.png",
// //       },
// //       stats: { likes: 12, dislikes: 4 },
// //       topComment: {
// //         comment_id: "comment-101",
// //         text: "This is very helpful! Remember to balance the hydrogens last.",
// //         created_at: new Date().toISOString(),
// //         likes: 15,
// //         dislikes: 15,
// //         author: {
// //           user_id: "user-tee",
// //           display_name: "Tee",
// //           profile_picture: "/image/DefaultAvatar.png",
// //         },
// //       },
// //     },
// //   ];
// //   // Filter mock data to simulate fetching a specific post
// //   // return mockData.filter(p => p.post_id === postId);
// //   return mockData
// // }

// // // API call to get comments for a specific post
// // // async function getCommentData(postId: string): Promise<CommentData[]> {
// // //   // This is mock data and doesn't depend on postId, but in a real app it would.
// // //   return [
// // //     {
// // //       id: "c1",
// // //       author: { display_name: "Alice Johnson", profile_picture: "https://i.pravatar.cc/40?img=1" },
// // //       text: "This is the first comment! 🚀",
// // //       created_at: new Date().toISOString(),
// // //       likes: 12,
// // //       dislikes: 1,
// // //       Replies: 2,
// // //     },
// // //     {
// // //       id: "c2",
// // //       author: { display_name: "Bob Smith", profile_picture: "https://i.pravatar.cc/40?img=2" },
// // //       text: "I totally agree with this post 🙌",
// // //       created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
// // //       likes: 8,
// // //       dislikes: 0,
// // //       Replies: 1,
// // //     },
// // //     {
// // //       id: "c3",
// // //       author: { display_name: "Charlie Brown", profile_picture: "https://i.pravatar.cc/40?img=3" },
// // //       text: "Hmm, I’m not so sure about this… 🤔",
// // //       created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
// // //       likes: 3,
// // //       dislikes: 5,
// // //       Replies: 0,
// // //     },
// // //   ];
// // // }


// // // --- Client Component ---
// // export default function PostPage({ postId }: Props) {
// //   // State to hold the fetched data
// //   const [post, setPost] = useState<PostData[]>([]);
// //   const [comments, setComments] = useState<CommentData[]>([]);
// //   // State to handle loading status
// //   const [isLoading, setIsLoading] = useState(true);

// //   // useEffect hook to fetch data when the component mounts or postId changes
// //   useEffect(() => {
// //     // Define an async function to fetch all necessary data
// //     const fetchAllData = async () => {
// //       try {
// //         setIsLoading(true); // Set loading to true before fetching
// //         // Fetch post and comments data concurrently
// //         const [postData, commentsData] = await Promise.all([
// //           getPostData(postId),
// //           getCommentData(postId)
// //         ]);
// //         setPost(postData);
// //         setComments(commentsData);
// //       } catch (error) {
// //         console.error("Failed to fetch data:", error);
// //         // Optionally, set an error state here to show an error message
// //       } finally {
// //         setIsLoading(false); // Set loading to false after fetching is complete
// //       }
// //     };

// //     fetchAllData();
// //   }, [postId]); // Re-run the effect if postId changes

// //   // Render a loading state while data is being fetched
// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <p className="text-xl">Loading post...</p>
// //       </div>
// //     );
// //   }
  
// //   // Render if no post is found
// //   // if (!post || post.length === 0) {
// //   //   return (
// //   //      <div className="min-h-screen flex items-center justify-center">
// //   //       <p className="text-xl">Post not found.</p>
// //   //     </div>
// //   //   );
// //   // }

// //   // Main component render
// //   return (
// //     <div className="min-h-screen bg-gray-50 flex flex-col font-display mt-20 px-70">
// //       <div className="flex flex-1">
// //         {/* Main Content */}
// //         <main className="flex-1 p-5">
// //           <div className="space-y-5">
// //             {post.map((p) => (
// //               <Post key={p.post_id} postData={p} />
// //             ))}
// //           </div>
// //           {/* Comments Section */}
// //           <div className="mt-8 pt-4 border-t border-gray-200">
// //             <h2 className="text-2xl font-semibold mb-4 text-dark-800">
// //               Comments ({comments.length})
// //             </h2>
// //             <div className="space-y-4">
// //               {comments.map((comment) => (
// //                 <Comment key={comment.id} commentData={comment} />
// //               ))}
// //             </div>
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }