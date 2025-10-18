export interface CommentData {
    id: string; 
    author: {
        user_id: number;
        display_name?: string | null;
        profile_picture: string;
    };
    text: string;
    created_at: string; // ISO date
    comment_image?: string | undefined;
    likes: number;
    dislikes: number;
    Replies: number;
    is_solution : boolean;
    updated_at?: string; // ISO date, optional
    is_edited?: boolean; // optional
    // parent_comment?: string | null; // ID of parent comment if this is a reply
    // replies?: CommentData[]; // Array of nested replies (populated by frontend)
}

export interface CommentContent {
    text: string;
    image?: string | null;
}

export type UserLikeStatus = 'none' | 'liked' | 'disliked';

export interface CommentProps {
    commentData: CommentData;
    onDelete?: (commentId:string) => void;
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
    handleCreateNewReply : (replyText: string) => Promise<boolean>;
    handleCreateNewComment: (commentText: string) => Promise<boolean>;
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