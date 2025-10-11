
import React from 'react';
import { CommentProps } from './types'; 
import { useCommentActions } from '@/components/comment/useCommentActions';
import { formatTimeAgo } from '@/components/comment/utils';

import { LikeButton } from '@/components/comment/LikeButton';
import { DislikeButton } from '@/components/comment/DislikeButton';
import { ReplyButton } from '@/components/comment/ReplyButton';
import { MoreActionsMenu } from '@/components/comment/MoreActionsMenu';
import { SolutionTag } from './SolutionTag';
import CommentContent from './CommentContent';

const Comment = ({ commentData }: CommentProps) => {

    const hasReplies = commentData.Replies > 0;

    const {
        likes,
        dislikes,
        userLikeStatus,
        isRepliesOpen,
        isReplying,
        anchorEl,
        isSolution,
        isEditing,
        draftContent,
        displayContent,
        handleLike,
        handleDislike,
        handleToggleReplies,
        handleToggleNewReply,
        handleCancelReply,
        handleCreateNewReply,
        handleMenuOpen,
        handleMenuClose,
        handleEdit,
        handleDelete,
        handleSetSolution,
    } = useCommentActions(commentData.id, commentData.likes, commentData.dislikes, commentData.is_solution);

    return (
        <div>
            <div className="flex items-start gap-3 relative">
                {hasReplies && (
                    <div className="absolute left-5 top-12 h-18 border-l-2 border-black"></div>
                )}
                <img src={commentData.author.profile_picture} alt={`${commentData.author.display_name}'s avatar`} className="w-10 h-10 rounded-full" />

                <div className="flex-grow">
                    {/* Header and Text Content */}
                    <div className = "flex items-baseline justify-between">
                        <div className="flex items-baseline  gap-3">
                            <span className="font-semibold text-xl" style={{ color: '#865DFF' }}>{commentData.author.display_name}</span>
                            <span className="text-base text-gray-400">{formatTimeAgo(commentData.created_at)}</span>
                            
                        </div>
                        {isSolution && <SolutionTag />}
                    </div>
                    {!isEditing ? (
                        <CommentContent content={displayContent ? displayContent : { text: commentData.text }} />
                    ) : (
                        <CommentContent content={draftContent ? draftContent : { text: commentData.text }} />
                    )} // turn the other one into input
                    {/* ACTION ROW (Using individual imported components) */}
                    <div className="flex items-center justify-between text-gray-500">
                        <div className="flex items-center gap-3 text-gray-500">
                            
                            {/* 1. Like Button */}
                            <LikeButton 
                                count={likes} 
                                userStatus={userLikeStatus} 
                                onClick={handleLike} 
                            />

                            {/* 2. Dislike Button */}
                            <DislikeButton 
                                count={dislikes} 
                                userStatus={userLikeStatus} 
                                onClick={handleDislike} 
                            />
                            <div className="flex items-center gap-7">
                            {/* 3. Reply Button */}
                                <ReplyButton 
                                    isReplying={isReplying} 
                                    onClick={handleToggleNewReply} 
                                />

                                {/* 4. More Actions Menu */}
                                <MoreActionsMenu
                                    anchorEl={anchorEl}
                                    handleMenuOpen={handleMenuOpen}
                                    handleMenuClose={handleMenuClose}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    handleSetSolution={handleSetSolution}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Reply Input Section: Opened by ReplyButton */}
                    {isReplying && (
                        <div className="mt-4 ">
                            <div className="flex items-start gap-2">
                                {/* Placeholder for user avatar */}
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                                <input
                                    type="text"
                                    placeholder="Write your reply..."
                                    className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-800"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={handleCancelReply} className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full">Cancel</button>
                                <button onClick={handleCreateNewReply} disabled className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full opacity-50">Reply</button>
                            </div>
                        </div>
                    )}
                    {/* Replies Section: Opened by View Replies Toggle */}
                    {isRepliesOpen && (
                        <div className="mt-4 relative pl-8 ">
                            {isRepliesOpen && (<div className="absolute -left-8 top-1/2 -translate-y-1/2 w-13 h-px bg-black"></div>)}
                            <p className="text-gray-500 italic">...Replies will be displayed here...</p>
                        </div>
                    )}

                    {/* View Replies Toggle */}
                    {hasReplies && (
                        <div className="mt-4 relative pl-8">
                            {!isRepliesOpen && (<div className="absolute -left-8 top-1/2 -translate-y-1/2 w-13 h-px bg-black"></div>)}
                            <button
                                className="text-purple-300 hover:text-blue-700 font-semibold text-sm"
                                onClick={handleToggleReplies}
                            >
                                {isRepliesOpen ? 'Hide replies' : `View ${commentData.Replies} replies`}
                            </button>
                        </div>
                    )}
                    
                    

                    
                </div>
            </div>
        </div>
    );
};

export default Comment;
































// import React, { useState } from 'react'; 

// import RecommendIcon from '@mui/icons-material/Recommend';
// import IconButton from '@mui/material/IconButton';
// import ReplyIcon from '@mui/icons-material/Reply';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import EditIcon from '@mui/icons-material/Edit';
// // import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';


// export interface CommentData{
//     id: string; // data type ไม่แน่ใจ
//     author: {
//         display_name: string;
//         profile_picture: string;
//     };
//     text: string;
//     created_at: string; // ISO date {แก้ภายหลัง}
//     likes: number;
//     dislikes: number;
//     // likeStatus อาจจะเปลี่ยนเป็น method เรียกใช้
//     Replies: number;
// }

// interface CommentProps{
//     commentData: CommentData;
// }

// const useCommentActions = (
//     commentId: string, 
//     initialLikes: number, 
//     initialDislikes: number,
//     // สมมติสถานะเริ่มต้นของผู้ใช้ (none, liked, disliked)
//     initialUserStatus: 'none' | 'liked' | 'disliked' = 'none' 
// ) => {
//    const [likes, setLikes] = useState(initialLikes);
//     const [dislikes, setDislikes] = useState(initialDislikes);
//     // สถานะใหม่: ติดตามว่าผู้ใช้ Like หรือ Dislike คอมเมนต์นี้อยู่หรือไม่
//     const [userLikeStatus, setUserLikeStatus] = useState(initialUserStatus);
    
//     const [isRepliesOpen, setIsRepliesOpen] = useState(false);
//     const [isReplying, setIsReplying] = useState(false); 
//     const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

//     const handleLike = () => {
//         if (userLikeStatus === 'liked') {
//             // 1. ถ้าเคยกด Like แล้ว -> ยกเลิก Like
//             setLikes(prev => prev - 1);
//             setUserLikeStatus('none');
//             console.log(`[ACTION] Unliking comment ID: ${commentId}`);
//         } else if (userLikeStatus === 'disliked') {
//             // 2. ถ้าเคยกด Dislike แล้ว -> เปลี่ยนเป็น Like (Like +1, Dislike -1)
//             setLikes(prev => prev + 1);
//             setDislikes(prev => prev - 1);
//             setUserLikeStatus('liked');
//             console.log(`[ACTION] Changing Dislike to Like for ID: ${commentId}`);
//         } else {
//             // 3. ถ้ายังไม่เคยทำอะไร -> กด Like
//             setLikes(prev => prev + 1);
//             setUserLikeStatus('liked');
//             console.log(`[ACTION] Liking comment ID: ${commentId}`);
//         }
//     };

//     const handleDislike = () => {
//         if (userLikeStatus === 'disliked') {
//             // 1. ถ้าเคยกด Dislike แล้ว -> ยกเลิก Dislike
//             setDislikes(prev => prev - 1);
//             setUserLikeStatus('none');
//             console.log(`[ACTION] Undisliking comment ID: ${commentId}`);
//         } else if (userLikeStatus === 'liked') {
//             // 2. ถ้าเคยกด Like แล้ว -> เปลี่ยนเป็น Dislike (Dislike +1, Like -1)
//             setDislikes(prev => prev + 1);
//             setLikes(prev => prev - 1);
//             setUserLikeStatus('disliked');
//             console.log(`[ACTION] Changing Like to Dislike for ID: ${commentId}`);
//         } else {
//             // 3. ถ้ายังไม่เคยทำอะไร -> กด Dislike
//             setDislikes(prev => prev + 1);
//             setUserLikeStatus('disliked');
//             console.log(`[ACTION] Disliking comment ID: ${commentId}`);
//         }
//     };


//     const handleToggleReplies = () => {
//         setIsRepliesOpen(prev => !prev);
//         if (!isRepliesOpen) {
//             console.log(`[ACTION] Fetching replies for comment ID: ${commentId}`);
//         }
//     };

//     // ฟังก์ชันสำหรับเปิด/ปิดช่องกรอกเพื่อตอบกลับใหม่
//     const handleToggleNewReply = () => {
//         setIsReplying(prev => !prev);
//     };

//     const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//         setAnchorEl(event.currentTarget);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//     };

//     const handleEdit = () => {
//         handleMenuClose();
//         console.log(`[ACTION] Editing comment ID: ${commentId}`);
//     };

//     const handleDelete = () => {
//         handleMenuClose();
//         console.log(`[ACTION] Deleting comment ID: ${commentId}`);
//     };

//     const handleSetSolution = () => {
//         handleMenuClose();
//         console.log(`[ACTION] Setting solution for comment ID: ${commentId}`);
//     };

//     // const handleMainReplyAction = (hasReplies: boolean) => {
        
//     //     // 1. สลับการเปิด/ปิดช่องกรอก Reply ใหม่ เสมอ
//     //     setIsReplying(prev => !prev);
//     //     console.log(`[ACTION] Toggle New Reply Input for ID: ${commentId}`);
        
//     //     // 2. ถ้ามี Replies อยู่แล้ว: สลับการแสดงผลรายการ Replies
//     //     if (hasReplies) {
//     //         setIsRepliesOpen(prev => !prev);
//     //         if (!isRepliesOpen) {
//     //              console.log(`[ACTION] Fetching replies for comment ID: ${commentId}`);
//     //         }
//     //     }
//     // };

//     const handleCancelReply = () => {
//         // ฟังก์ชันสำหรับปุ่มยกเลิกในช่องกรอก (ปิดช่องกรอก)
//         setIsReplying(false);
//     };
//      return { 
//         likes, 
//         dislikes, 
//         userLikeStatus, // สถานะใหม่
//         isRepliesOpen, 
//         isReplying,
//         anchorEl,
//         handleLike, 
//         handleDislike, 
//         handleToggleReplies,
//         handleToggleNewReply,
//         handleCancelReply,
//         handleMenuOpen,
//         handleMenuClose,
//         handleEdit,
//         handleDelete,
//         handleSetSolution,
//     };
// }

// // ***reusable***
// const formatTimeAgo = (dateString: string) => {
//     // เวลาปัจจุบัน
//     const now:number = Date.now();
//     // เวลาที่สร้าง
//     const createdTime: number = new Date(dateString).getTime();
//     // ผลต่างเวลา
//     const timeDifference : number = Math.floor((now - createdTime)/1000);
//     // ค่าที่ใช้แปลงเวลา
//     const intervals: {[key:string]:number}= {
//         year: 31536000,
//         month: 2592000,
//         day: 86400,
//         hour: 3600,
//         minute: 60,
//         second: 1
//     }
//     // แปลงหน่วยเวลา
//     for(const unit in intervals){
//         const intervalValue = intervals[unit];
//         const count = Math.floor(timeDifference / intervalValue);

//         if(count >= 1){
//             const unitName = count === 1 ? unit : unit + 's';
//             return `${count} ${unitName} ago`;
//         }
//     }

//     return "just now"; 
// };



// const Comment= ({ commentData }: CommentProps) => {
    
//     const hasReplies = commentData.Replies > 0;
    
//     const { 
//         likes, 
//         dislikes, 
//         userLikeStatus, // ดึงสถานะใหม่
//         isRepliesOpen, 
//         isReplying,
//         anchorEl,
//         handleLike, 
//         handleDislike, 
//         handleToggleReplies,
//         handleToggleNewReply,
//         handleCancelReply, 
//         handleMenuOpen,
//         handleMenuClose,
//         handleEdit,
//         handleDelete,
//         handleSetSolution,
//     } = useCommentActions(commentData.id, commentData.likes, commentData.dislikes);

//     // กำหนดข้อความสำหรับปุ่ม Reply/View Replies
//     let replyButtonLabel = 'Reply';
//     if (hasReplies && isRepliesOpen) {
//         replyButtonLabel = 'Hide replies';
//     } else if (hasReplies) {
//         replyButtonLabel = `View ${commentData.Replies} replies`;
//     } 

//     // กำหนดสีของ SVG icon ตามสถานะของผู้ใช้
//     const likeIconStyle = userLikeStatus === 'liked' ? 'text-blue-600 fill-blue-600' : 'text-gray-500 hover:text-dark-900';
//     const dislikeIconStyle = userLikeStatus === 'disliked' ? 'text-blue-600 fill-blue-600' : 'text-gray-500 hover:text-dark-900';

//     return (
//         <div>
//             <div className="flex items-start gap-3">
//                 <img src={commentData.author.profile_picture} alt={`${commentData.author.display_name}'s avatar`} className="w-10 h-10 rounded-full" />
                
//                 <div className="flex-grow">
//                     {/* Header และ Text Content */}
//                     <div className="flex items-baseline gap-3">
//                         <span className="font-semibold text-xl"style={{ color: '#865DFF' }}>{commentData.author.display_name}</span>
//                         <span className="text-base text-gray-400">{formatTimeAgo(commentData.created_at)}</span>
//                     </div>
//                     <p className="text-gray-600 my-1 text-base">{commentData.text}</p>
                    
//                     {/* ACTION ROW */}
//                     <div className="flex items-center justify-between text-gray-500">
//                         <div className="flex items-center gap-3 text-gray-500">
//                             {/* Like Button */}
//                             <button 
//                                 className=" rounded-full hover:bg-gray-100"
//                                 onClick={handleLike}
//                                 aria-label="Like comment"
//                             >
//                                 <IconButton  
//                                     // 2. Set the color on the IconButton
//                                     color={userLikeStatus === 'liked' ? 'primary' : 'default'}
                                    
//                                     aria-label="like button"
//                                     size="small"
//                                     >
//                                     {userLikeStatus === 'liked' ? (
//                                         // 3. Show the solid icon when liked
//                                         <RecommendIcon/>
//                                     ) : (
//                                         // 4. Show the outlined icon when not liked
//                                         <RecommendIcon/>
//                                     )}
//                                     </IconButton>
//                                 {/* <svg 
//                                     // ใช้ dynamic class และ fill เพื่อให้แสดงสถานะ Like ที่ทำงานอยู่
//                                     className={`w-4 h-4 cursor-pointer ${likeIconStyle}`} 
//                                     xmlns="http://www.w3.org/2000/svg" 
//                                     viewBox="0 0 24 24" 
//                                     fill={userLikeStatus === 'liked' ? 'currentColor' : 'none'} // ถ้า liked ให้ fill
//                                     stroke="currentColor" 
//                                     strokeWidth="2" 
//                                     strokeLinecap="round" 
//                                     strokeLinejoin="round"
//                                 >
//                                     <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z" />
//                                 </svg> */}
//                             </button>
//                             <span className="text-base font-bold min-w-[1.25rem]">{likes > 0 ? likes : ''}</span>
                            
//                             {/* Dislike Button */}
//                             <button 
//                                 className="p-1 rounded-full hover:bg-gray-100"
//                                 onClick={handleDislike}
//                                 aria-label="Dislike comment"
//                             >
//                                   <IconButton

//                                     color={userLikeStatus === 'disliked' ? 'primary' : 'default'}
//                                     aria-label="Dislike comment"
//                                     size="small"
//                                     style={{ transform: 'scaleY(-1) scaleX(-1)' }}
//                                 >
//                                     {userLikeStatus === 'disliked' ? <RecommendIcon/>: <RecommendIcon/>}
//                                 </IconButton>
//                                 {/* <svg 
//                                     // ใช้ dynamic class และ fill เพื่อให้แสดงสถานะ Dislike ที่ทำงานอยู่
//                                     className={`w-4 h-4 cursor-pointer ${dislikeIconStyle}`} 
//                                     xmlns="http://www.w3.org/2000/svg" 
//                                     viewBox="0 0 24 24" 
//                                     fill={userLikeStatus === 'disliked' ? 'currentColor' : 'none'} // ถ้า disliked ให้ fill
//                                     stroke="currentColor" 
//                                     strokeWidth="2" 
//                                     strokeLinecap="round" 
//                                     strokeLinejoin="round"
//                                 >
//                                     <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" />
//                                 </svg> */}
//                             </button>
//                             <span className="text-base font-bold min-w-[1.25rem]">{dislikes > 0 ? dislikes : ''}</span>

//                             {/* Reply Button */}
                            
//                             <button 
//                                 className=" rounded-full hover:bg-gray-100"
//                                 onClick={handleToggleNewReply}
//                                 aria-label="New Reply"
//                             >
//                                   <IconButton

//                                     color={isReplying ? 'primary' : 'default'}
//                                     aria-label="Reply comment"
//                                     size="small"
//                                     style={isReplying ? { backgroundColor: '#1976d2', color: 'white' } : {}}
    
//                                 >
//                                     {isReplying ? <ReplyIcon/>: <ReplyIcon/>}
//                                 </IconButton>
//                                 {/* <svg 
//                                     // ใช้ dynamic class และ fill เพื่อให้แสดงสถานะ Dislike ที่ทำงานอยู่
//                                     className={`w-4 h-4 cursor-pointer ${dislikeIconStyle}`} 
//                                     xmlns="http://www.w3.org/2000/svg" 
//                                     viewBox="0 0 24 24" 
//                                     fill={userLikeStatus === 'disliked' ? 'currentColor' : 'none'} // ถ้า disliked ให้ fill
//                                     stroke="currentColor" 
//                                     strokeWidth="2" 
//                                     strokeLinecap="round" 
//                                     strokeLinejoin="round"
//                                 >
//                                     <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" />
//                                 </svg> */}
//                             </button>

//                             <IconButton
//                                 aria-label="display more actions"
//                                 onClick={handleMenuOpen}
//                                 size="small"
//                             >
//                                 <MoreHorizIcon fontSize="small" />
//                             </IconButton>
//                             <Menu
//                                 anchorEl={anchorEl}
//                                 open={Boolean(anchorEl)}
//                                 onClose={handleMenuClose}
//                             >
//                                 <MenuItem onClick={handleEdit}>
//                                     <EditIcon sx={{ mr: 1 }} fontSize="small" />
//                                     Edit
//                                 </MenuItem>
//                                 <MenuItem onClick={handleDelete}>
//                                     {/* <DeleteForeverIcon sx={{ mr: 1 }} fontSize="small" /> */}
//                                     Delete
//                                 </MenuItem>
//                                 <MenuItem onClick={handleSetSolution}>
//                                     <LightbulbOutlinedIcon sx={{ mr: 1 }} fontSize="small" />
//                                     Solution
//                                 </MenuItem>
//                             </Menu>


//                         </div>
                     
                        
                        
                        
                        
//                     </div>
//                     {hasReplies && (
//                         <div className="mt-2">
//                              <button 
//                                 className="text-purple-300 hover:text-blue-700 font-semibold text-sm"
//                                 onClick={handleToggleReplies}
//                              >
//                                 {isRepliesOpen ? 'Hide replies' : `View ${commentData.Replies} replies`}
//                             </button>
//                         </div>
//                     )}
//                     {/* Reply Input Section: เปิด/ปิด ด้วย isReplying */}
//                     {isReplying && (
//                         <div className="mt-4">
//                              <div className="flex items-start gap-2">
//                                 {/* Placeholder for user avatar */}
//                                 <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div> 
//                                 <input 
//                                     type="text" 
//                                     placeholder="Write your reply..." 
//                                     className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-800"
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-2 mt-2">
//                                 <button onClick={handleCancelReply} className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full">Cancel</button>
//                                 <button disabled className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full opacity-50">Reply</button>
//                             </div>
//                         </div>
//                     )}

//                     {/* Replies Section: เปิด/ปิด ด้วย isRepliesOpen */}
//                     {isRepliesOpen && (
//                         <div className="mt-4 border-l-2 border-gray-200 pl-4">
//                             <p className="text-gray-500 italic">...Replies will be displayed here...</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Comment;