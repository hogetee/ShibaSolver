import { useState } from 'react';

import { CommentContent, UserLikeStatus } from '@/components/comment/types'; 
import { CommentActions } from '@/components/comment/types';


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

    const [isEditing, setIsEditing] = useState(false);
    const [draftContent, setDraftContent] = useState<CommentContent | null>(null);
    const [displayContent, setDisplayContent] = useState<CommentContent | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleCreateNewReply = async (replyText: string) => {
        // Simulate creating a reply. In a real app you'd POST to an API.
        try {
            console.log(`[ACTION] create reply for ${commentId}:`, replyText);
            // Simulate network latency
            await new Promise((r) => setTimeout(r, 200));
            // Close reply input and open replies
            setIsReplying(false);
            if (!isRepliesOpen) setIsRepliesOpen(true);
            return true;
        } catch (err) {
            console.error('Failed to create reply', err);
            return false;
        }
    };

    const handleCreateNewComment = async (commentText: string) => {
        // Simulate creating a comment. In a real app you'd POST to an API.
        try {
            console.log(`[ACTION] create comment for ${commentId}:`, commentText);
            // Simulate network latency
            await new Promise((r) => setTimeout(r, 200));
            return true;
        } catch (err) {
            console.error('Failed to create comment', err);
            return false;
        }
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
        setIsEditing(true);
    };

    const handleSaveEdit = (newContent: CommentContent) => {
        setDisplayContent(newContent);
        setDraftContent(newContent);
        setIsEditing(false);
        console.log(`[ACTION] Saved edited content for comment ID: ${commentId}`, newContent);
        // TODO: API call to save edited content
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDeleteModalOpen = () => {
        setIsDeleteModalOpen(true);
        handleMenuClose();
    }

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    }
    
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
        isEditing,
        draftContent,
        displayContent,
        isDeleteModalOpen,
        handleLike,
        handleDislike,
        handleToggleReplies,
        handleToggleNewReply,
        handleCreateNewComment,
        handleCancelReply,
        handleCreateNewReply,
        handleMenuOpen,
        handleMenuClose,
        handleEdit,
        handleSaveEdit,
        handleCancelEdit,
        handleDeleteModalOpen,
        handleDeleteModalClose,
        handleDelete,
        handleSetSolution,
    };
}