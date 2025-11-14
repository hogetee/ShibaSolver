export interface CommentData {
    id: string; 
    author: {
        user_id: number;
        display_name?: string | null;
        profile_picture: string;
    };
    text: string;
    created_at: string;
    comment_image?: string | undefined;
    likes: number;
    dislikes: number;
    Replies: number;
    is_solution: boolean;
    updated_at?: string;
    is_edited?: boolean;
    parent_comment: number | null; // ADD THIS - ID of parent comment if this is a reply
}

export interface CommentContent {
    text: string;
    image?: string | null;
}

export type UserLikeStatus = 'none' | 'liked' | 'disliked';

export interface CommentProps {
    commentData: CommentData;
    allComments?: CommentData[];
    onDelete?: (commentId:string) => void;
    postId: string;
}

// Interfaces for Action Buttons
export interface ActionButtonProps {
    count: number;
    userStatus: UserLikeStatus; 
    onClick: () => void;
}

export interface ReplyButtonProps {
    isReplying: boolean;
    onClick: () => void;
}

export interface MoreActionsButtonProps {
    anchorEl: null | HTMLElement;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handleEdit: () => void;
    handleDelete: () => void;
    handleSetSolution: () => void;
    handleDeleteModalOpen: () => void;
    handleDeleteModalClose: () => void;
    owner?: boolean;
    handleReportClick: () => void;
}

// New interfaces for reply functionality
export interface ViewRepliesButtonProps {
    replyCount: number;
    isOpen: boolean;
    onClick: () => void;
}

export interface ReplyItemProps {
    reply: CommentData;
    onDelete?: (replyId: string) => void;
    level?: number; // For nested indentation
}

export interface CommentActions {
    likes: number;
    dislikes: number;
    userLikeStatus: UserLikeStatus;
    isRepliesOpen: boolean;
    isReplying: boolean;
    anchorEl: null | HTMLElement;
    isSolution: boolean;
    attachedImagePreview: string | null;
    isEditing: boolean;
    draftContent: CommentContent | null;
    displayContent: CommentContent | null;
    isDeleteModalOpen: boolean;
    // handleLike: () => void;
    // handleDislike: () => void;
    toggleLike: () => void;
    toggleDislike: () => void;
    handleToggleReplies: () => void;
    handleToggleNewReply: () => void;
    handleCancelReply: () => void;
    handleCreateNewReply : (post_id: number, replyText: string, attachment?: string | null) => Promise<boolean>;
    handleCreateNewComment: (post_id: number, commentText: string, attachment?: string | null) => Promise<boolean>;
    handleAttachImage: (file: File | null) => Promise<string | null>;
    handleRemoveAttachment: () => void;
    handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
    handleMenuClose: () => void;
    handleEdit: () => void;
    handleSaveEdit: (newContent: CommentContent) => void;
    handleCancelEdit: () => void;
    handleDeleteModalOpen: () => void;
    handleDeleteModalClose: () => void;
    handleDelete: () => void;
    handleSetSolution: () => void;
}