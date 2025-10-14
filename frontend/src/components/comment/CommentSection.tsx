"use client"; 

import { useState } from 'react';
import Comment from "@/components/comment/Comment";
import { CommentData } from '@/components/comment/types';
import CreateComment from './CreateComment';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCommentActions } from '@/components/comment/useCommentActions';

interface Props {
  initialComments: CommentData[];
}

export default function CommentSection({ initialComments }: Props) {
    const [comments, setComments] = useState<CommentData[]>(initialComments);
    //current user for creating comment
    const { user: currentUser } = useCurrentUser();
    const { handleCreateNewComment } = useCommentActions('root', 0, 0, false);
    
    return (
        <>
        {/* A section to create a new comment could go here */}
        <div className="w-full bg-white cursor-pointer hover:shadow-2xl/15 rounded-2xl shadow-lg p-3 flex flex-col font-display">
            {/* CreateComment component */}
            <CreateComment
                placeholder="Create a new comment..."
                author={currentUser ? {
                    profile_picture: currentUser.profile_picture ?? undefined,
                    display_name: currentUser.display_name ?? undefined,
                } : undefined}
                onSubmit={(text) => handleCreateNewComment(text)}
            />
        </div>
        {/* The list of comments is rendered from state */}
        <div className="mt-5 pt-4 border-t ">
            <h2 className="text-2xl font-semibold mb-4 text-dark-800">
            Comments ({comments.length})
            </h2>
            <div className="space-y-4">
            {comments.map((comment) => (
                <Comment key={comment.id} commentData={comment} />
            ))}
            </div>
        </div>
        </>
    );
}