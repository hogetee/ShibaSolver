
import React, { useState } from 'react'; 

export interface CommentData{
    id: string; // data type ไม่แน่ใจ
    author: {
        display_name: string;
        profile_picture: string;
    };
    text: string;
    created_at: string; // ISO date {แก้ภายหลัง}
    likes: number;
    dislikes: number;
    // likeStatus อาจจะเปลี่ยนเป็น method เรียกใช้
    Replies: number;
}

interface CommentProps{
    commentData: CommentData;
}

const useCommentActions = (
    commentId: string, 
    initialLikes: number, 
    initialDislikes: number,
    // สมมติสถานะเริ่มต้นของผู้ใช้ (none, liked, disliked)
    initialUserStatus: 'none' | 'liked' | 'disliked' = 'none' 
) => {
   const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    // สถานะใหม่: ติดตามว่าผู้ใช้ Like หรือ Dislike คอมเมนต์นี้อยู่หรือไม่
    const [userLikeStatus, setUserLikeStatus] = useState(initialUserStatus);
    
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false); 

    const handleLike = () => {
        if (userLikeStatus === 'liked') {
            // 1. ถ้าเคยกด Like แล้ว -> ยกเลิก Like
            setLikes(prev => prev - 1);
            setUserLikeStatus('none');
            console.log(`[ACTION] Unliking comment ID: ${commentId}`);
        } else if (userLikeStatus === 'disliked') {
            // 2. ถ้าเคยกด Dislike แล้ว -> เปลี่ยนเป็น Like (Like +1, Dislike -1)
            setLikes(prev => prev + 1);
            setDislikes(prev => prev - 1);
            setUserLikeStatus('liked');
            console.log(`[ACTION] Changing Dislike to Like for ID: ${commentId}`);
        } else {
            // 3. ถ้ายังไม่เคยทำอะไร -> กด Like
            setLikes(prev => prev + 1);
            setUserLikeStatus('liked');
            console.log(`[ACTION] Liking comment ID: ${commentId}`);
        }
    };

    const handleDislike = () => {
        if (userLikeStatus === 'disliked') {
            // 1. ถ้าเคยกด Dislike แล้ว -> ยกเลิก Dislike
            setDislikes(prev => prev - 1);
            setUserLikeStatus('none');
            console.log(`[ACTION] Undisliking comment ID: ${commentId}`);
        } else if (userLikeStatus === 'liked') {
            // 2. ถ้าเคยกด Like แล้ว -> เปลี่ยนเป็น Dislike (Dislike +1, Like -1)
            setDislikes(prev => prev + 1);
            setLikes(prev => prev - 1);
            setUserLikeStatus('disliked');
            console.log(`[ACTION] Changing Like to Dislike for ID: ${commentId}`);
        } else {
            // 3. ถ้ายังไม่เคยทำอะไร -> กด Dislike
            setDislikes(prev => prev + 1);
            setUserLikeStatus('disliked');
            console.log(`[ACTION] Disliking comment ID: ${commentId}`);
        }
    };

    // ฟังก์ชันหลักสำหรับการจัดการ Reply (เปิด Reply Input เสมอ และสลับ Replies ถ้ามี)
    const handleMainReplyAction = (hasReplies: boolean) => {
        
        // 1. สลับการเปิด/ปิดช่องกรอก Reply ใหม่ เสมอ
        setIsReplying(prev => !prev);
        console.log(`[ACTION] Toggle New Reply Input for ID: ${commentId}`);
        
        // 2. ถ้ามี Replies อยู่แล้ว: สลับการแสดงผลรายการ Replies
        if (hasReplies) {
            setIsRepliesOpen(prev => !prev);
            if (!isRepliesOpen) {
                 console.log(`[ACTION] Fetching replies for comment ID: ${commentId}`);
            }
        }
    };

    const handleCancelReply = () => {
        // ฟังก์ชันสำหรับปุ่มยกเลิกในช่องกรอก (ปิดช่องกรอก)
        setIsReplying(false);
    };
     return { 
        likes, 
        dislikes, 
        userLikeStatus, // สถานะใหม่
        isRepliesOpen, 
        isReplying,
        handleLike, 
        handleDislike, 
        handleMainReplyAction,
        handleCancelReply 
    };
}

// ***reusable***
const formatTimeAgo = (dateString: string) => {
    // เวลาปัจจุบัน
    const now:number = Date.now();
    // เวลาที่สร้าง
    const createdTime: number = new Date(dateString).getTime();
    // ผลต่างเวลา
    const timeDifference : number = Math.floor((now - createdTime)/1000);
    // ค่าที่ใช้แปลงเวลา
    const intervals: {[key:string]:number}= {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }
    // แปลงหน่วยเวลา
    for(const unit in intervals){
        const intervalValue = intervals[unit];
        const count = Math.floor(timeDifference / intervalValue);

        if(count >= 1){
            const unitName = count === 1 ? unit : unit + 's';
            return '${count} ${unitName} ago';
        }
    }

    return "just now"; 
};



const Comment= ({ commentData }: CommentProps) => {
    
    const hasReplies = commentData.Replies > 0;
    
    const { 
        likes, 
        dislikes, 
        userLikeStatus, // ดึงสถานะใหม่
        isRepliesOpen, 
        isReplying,
        handleLike, 
        handleDislike, 
        handleMainReplyAction,
        handleCancelReply 
    } = useCommentActions(commentData.id, commentData.likes, commentData.dislikes);

    // กำหนดข้อความสำหรับปุ่ม Reply/View Replies
    let replyButtonLabel = 'Reply';
    if (hasReplies && isRepliesOpen) {
        replyButtonLabel = 'Hide replies';
    } else if (hasReplies) {
        replyButtonLabel = `View ${commentData.Replies} replies`;
    } 

    // กำหนดสีของ SVG icon ตามสถานะของผู้ใช้
    const likeIconStyle = userLikeStatus === 'liked' ? 'text-blue-600 fill-blue-600' : 'text-gray-500 hover:text-dark-900';
    const dislikeIconStyle = userLikeStatus === 'disliked' ? 'text-blue-600 fill-blue-600' : 'text-gray-500 hover:text-dark-900';

    return (
        <div>
            <div className="flex items-start gap-3">
                <img src={commentData.author.profile_picture} alt={`${commentData.author.display_name}'s avatar`} className="w-8 h-8 rounded-full" />
                
                <div className="flex-grow">
                    {/* Header และ Text Content */}
                    <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-dark-900">{commentData.author.display_name}</span>
                        <span className="text-xs text-gray-400">{formatTimeAgo(commentData.created_at)}</span>
                    </div>
                    <p className="text-gray-600 mt-1 mb-2">{commentData.text}</p>
                    
                    {/* ACTION ROW */}
                    <div className="flex items-center justify-between text-gray-500">
                        
                        {/* === LEFT SIDE GROUP: ปุ่ม Reply / View Replies === */}
                        <div className="flex items-center gap-4 text-sm font-medium">
                            
                            <button 
                                className="text-blue-500 hover:text-blue-700 font-normal" 
                                onClick={() => handleMainReplyAction(hasReplies)}
                            >
                                {replyButtonLabel}
                            </button>
                            
                        </div>
                        
                        {/* === RIGHT SIDE GROUP: Like/Dislike Buttons and Count === */}
                        <div className="flex items-center gap-2 text-gray-500">
                            {/* Like Button */}
                            <button 
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={handleLike}
                                aria-label="Like comment"
                            >
                                <svg 
                                    // ใช้ dynamic class และ fill เพื่อให้แสดงสถานะ Like ที่ทำงานอยู่
                                    className={`w-4 h-4 cursor-pointer ${likeIconStyle}`} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill={userLikeStatus === 'liked' ? 'currentColor' : 'none'} // ถ้า liked ให้ fill
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z" />
                                </svg>
                            </button>
                            <span className="text-sm font-bold">{likes}</span>
                            
                            {/* Dislike Button */}
                            <button 
                                className="p-1 rounded-full hover:bg-gray-100"
                                onClick={handleDislike}
                                aria-label="Dislike comment"
                            >
                                <svg 
                                    // ใช้ dynamic class และ fill เพื่อให้แสดงสถานะ Dislike ที่ทำงานอยู่
                                    className={`w-4 h-4 cursor-pointer ${dislikeIconStyle}`} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill={userLikeStatus === 'disliked' ? 'currentColor' : 'none'} // ถ้า disliked ให้ fill
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" />
                                </svg>
                            </button>
                            <span className="text-sm font-bold">{dislikes}</span>
                        </div>
                    </div>

                    {/* Reply Input Section: เปิด/ปิด ด้วย isReplying */}
                    {isReplying && (
                        <div className="mt-4">
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
                                <button disabled className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full opacity-50">Reply</button>
                            </div>
                        </div>
                    )}

                    {/* Replies Section: เปิด/ปิด ด้วย isRepliesOpen */}
                    {isRepliesOpen && (
                        <div className="mt-4 border-l-2 border-gray-200 pl-4">
                            <p className="text-gray-500 italic">...Replies will be displayed here...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;