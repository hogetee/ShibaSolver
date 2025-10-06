export interface CommentData {
    id: string; 
    author: {
        display_name: string;
        profile_picture: string;
    };
    text: string;
    created_at: string; // ISO date
    
    likes: number;
    dislikes: number;
    Replies: number;
    is_solution : boolean;
}

export type UserLikeStatus = 'none' | 'liked' | 'disliked';

export interface CommentProps {
    commentData: CommentData;
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
}