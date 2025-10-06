import { useState } from 'react';
import { UserLikeStatus } from '@/components/comment/types'; 



interface CommentActions {
    likes: number;
    dislikes: number;
    userLikeStatus: UserLikeStatus;
    isRepliesOpen: boolean;
    isReplying: boolean;
    anchorEl: null | HTMLElement;
    isSolution: boolean;
    handleLike: () => void;
    handleDislike: () => void;
    handleToggleReplies: () => void;
    handleToggleNewReply: () => void;
    handleCancelReply: () => void;
    handleCreateNewReply : () => void;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
    handleSetSolution: () => void;
}

export const useCommentActions = (
    commentId: string,
    initialLikes: number,
    initialDislikes: number,
    initialSolution: boolean,
    initialUserStatus: UserLikeStatus = 'none'
): CommentActions => {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userLikeStatus, setUserLikeStatus] = useState(initialUserStatus);

    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isSolution, setIsSolution] = useState(initialSolution);

    const handleLike = () => {
        if (userLikeStatus === 'liked') {
            setLikes(prev => prev - 1);
            setUserLikeStatus('none');
            console.log(`[ACTION] Unliking comment ID: ${commentId}`);
        } else if (userLikeStatus === 'disliked') {
            setLikes(prev => prev + 1);
            setDislikes(prev => prev - 1);
            setUserLikeStatus('liked');
            console.log(`[ACTION] Changing Dislike to Like for ID: ${commentId}`);
        } else {
            setLikes(prev => prev + 1);
            setUserLikeStatus('liked');
            console.log(`[ACTION] Liking comment ID: ${commentId}`);
        }
        // In a real app, you'd send an API request here
    };

    const handleDislike = () => {
        if (userLikeStatus === 'disliked') {
            setDislikes(prev => prev - 1);
            setUserLikeStatus('none');
            console.log(`[ACTION] Undisliking comment ID: ${commentId}`);
        } else if (userLikeStatus === 'liked') {
            setDislikes(prev => prev + 1);
            setLikes(prev => prev - 1);
            setUserLikeStatus('disliked');
            console.log(`[ACTION] Changing Like to Dislike for ID: ${commentId}`);
        } else {
            setDislikes(prev => prev + 1);
            setUserLikeStatus('disliked');
            console.log(`[ACTION] Disliking comment ID: ${commentId}`);
        }
         // In a real app, you'd send an API request here
    };


    const handleToggleReplies = () => {
        setIsRepliesOpen(prev => !prev);
        if (!isRepliesOpen) {
            console.log(`[ACTION] Fetching replies for comment ID: ${commentId}`);
        }
    };

    const handleToggleNewReply = () => {
        setIsReplying(prev => !prev);
    };

    const handleCreateNewReply = () => {
        console.log(`create reply for ${commentId}`);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        // const rect = event.currentTarget.getBoundingClientRect();
        // setAnchorEl({
        //     top: rect.top + window.scrollY,   // Add scrollY to account for page scroll
        //     left: rect.left + window.scrollX, // Add scrollX to account for page scroll
        // });
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        console.log(`[ACTION] Editing comment ID: ${commentId}`);
    };

    const handleDelete = () => {
        handleMenuClose();
        console.log(`[ACTION] Deleting comment ID: ${commentId}`);
    };

    const handleSetSolution = () => {
        handleMenuClose();
        console.log(`[ACTION] Setting solution for comment ID: ${commentId}`);
    };

    const handleCancelReply = () => {
        setIsReplying(false);
    };
    
    return {
        likes,
        dislikes,
        userLikeStatus,
        isRepliesOpen,
        isReplying,
        anchorEl,
        isSolution,
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
        
    };
}