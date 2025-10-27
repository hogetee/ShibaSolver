'use client';

import React, { useState } from 'react';
import PostHeader from '../PostHeader';
import PostContent from '../PostContent';
import DedicatedPostAuthor from './DedicatedPostAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import EditPostModal, { UpdatedPostData } from '../EditPostModal';
import DeletePostModal from '../DeletePostModal';
import { useUpdatePost } from '@/hooks/useUpdatePost';
import { useDeletePost } from '@/hooks/useDeletePost';

// --- Interface for post data (same shape as main Post) ---
export interface DedicatedPostData {
  post_id: string;
  title: string;
  description: string;
  post_image?: string;
  is_solved: boolean;
  created_at: string;
  tags: string[];
  author: {
    user_id: string;
    display_name: string;
    profile_picture: string;
  };
  stats: {
    likes: number;
    dislikes: number;
  };
  liked_by_user: boolean;
  disliked_by_user: boolean;
}

interface DedicatedPostProps {
  dedicatedPostData: DedicatedPostData;
  onPostUpdate?: (updatedPost: DedicatedPostData) => void;
  onPostDelete?: (postId: string) => void;
}

const DedicatedPost = ({
  dedicatedPostData: initialData,
  onPostUpdate,
  onPostDelete,
}: DedicatedPostProps) => {
  const [postData, setPostData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { user } = useCurrentUser();
  const { updatePost, isUpdating } = useUpdatePost();
  const { deletePost, isDeleting } = useDeletePost();

  const isCurrentUserAuthor = user ? String(user.user_id) === postData.author.user_id : false;

  // ✅ Handle save after editing post
  const handleSaveEdit = async (dataFromModal: UpdatedPostData) => {
    try {
      const response = await updatePost(postData.post_id, dataFromModal);
      if (!response || !response.data) throw new Error('Invalid update response');

      const updatedApiData = response.data;
      const updatedPost: DedicatedPostData = {
        ...postData,
        title: updatedApiData.title,
        description: updatedApiData.description,
        post_image: updatedApiData.post_image || undefined,
        is_solved: updatedApiData.is_solved,
        tags: response.tags,
      };

      setPostData(updatedPost);
      onPostUpdate?.(updatedPost);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating dedicated post:', error);
      alert(`Failed to update post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // ✅ Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      await deletePost(postData.post_id);
      setIsDeleteModalOpen(false);
      onPostDelete?.(postData.post_id);
    } catch (error) {
      console.error('Error deleting dedicated post:', error);
      alert(`Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <div className="w-full min-h-[30vh] bg-white rounded-2xl shadow-lg p-6 flex flex-col font-display">
        {/* Header (tags + solved indicator + edit/delete if author) */}
        <PostHeader
          isSolved={postData.is_solved}
          tags={postData.tags}
          isCurrentUserAuthor={isCurrentUserAuthor}
          onEditClick={() => setIsEditModalOpen(true)}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />

        {/* Title + description + image */}
        <PostContent
          title={postData.title}
          description={postData.description}
          postImage={postData.post_image}
        />

        {/* Author info + like/dislike controls */}
        <DedicatedPostAuthor
          postId={postData.post_id}
          author={postData.author}
          stats={postData.stats}
          liked_by_user={postData.liked_by_user}
          disliked_by_user={postData.disliked_by_user}
        />
      </div>

      {/* --- Edit modal --- */}
      {isEditModalOpen && (
        <EditPostModal
          postToEdit={postData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          isSaving={isUpdating}
        />
      )}

      {/* --- Delete modal --- */}
      {isDeleteModalOpen && (
        <DeletePostModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default DedicatedPost;