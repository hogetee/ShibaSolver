"use client"; 

import { useState } from 'react';
import Comment,{ CommentData } from "@/components/comment/Comment";


interface Props {
  initialComments: CommentData[];
}

export default function CommentSection({ initialComments }: Props) {
    const [comments, setComments] = useState<CommentData[]>(initialComments);

  
    return (
        <>
        {/* A section to create a new comment could go here */}

        {/* The list of comments is rendered from state */}
        <div className="mt-8 pt-4 border-t ">
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