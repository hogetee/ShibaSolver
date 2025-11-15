'use client';

import React, { useState } from 'react';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostAuthor from './PostAuthor';
import TopComment from './TopComment';
import { slugify } from '@/utils/slugify';
import Link from 'next/link';
import EditPostModal, { UpdatedPostData } from './EditPostModal'; 
import DeletePostModal from './DeletePostModal'; 
import ReportPostModal from './ReportPostModal'; // 1. Import Modal ใหม่
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUpdatePost } from '@/hooks/useUpdatePost'; 
import { useDeletePost } from '@/hooks/useDeletePost';

export interface PostData {
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
  topComment?: {
    comment_id: string;
    text: string;
    comment_image?: string;
    created_at: string;
    likes: number;
    dislikes: number;
    author: {
      user_id: string;
      display_name: string;
      profile_picture: string;
    };
  };
  stats: {
    likes: number;
    dislikes: number;
  };
  liked_by_user: boolean;
  disliked_by_user: boolean;
}

interface PostProps {
  postData: PostData;
  onPostUpdate: (updatedPost: PostData) => void;
  onPostDelete: (postId: string) => void;
}

const Post = ({ postData: initialPostData, onPostUpdate, onPostDelete }: PostProps) => {

  const [postData, setPostData] = useState(initialPostData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 2. สร้าง State สำหรับ Report Modal
  
  const { user } = useCurrentUser();
  const { updatePost, isUpdating, error: updateError } = useUpdatePost(); 
  const { deletePost, isDeleting } = useDeletePost();

  const isCurrentUserAuthor = user ? String(user.user_id) === postData.author.user_id : false;
  const href = `/post/${postData.post_id}/${slugify(postData.title)}`;

  const handleSaveEdit = async (dataFromModal: UpdatedPostData) => {
    try {
      // 1. ส่งข้อมูลไปอัปเดตเหมือนเดิม
      const response = await updatePost(postData.post_id, dataFromModal);

      // 2. สร้าง "ด่านตรวจ" ที่แข็งแกร่ง
      //    - เช็คก่อนว่า response และ response.data มีอยู่จริงหรือไม่
      if (!response || !response.data) {
        // ถ้าไม่มี ให้โยน Error ออกไปพร้อมข้อความที่ชัดเจน
        throw new Error("Invalid response received from server after update.");
      }

      // 3. ถ้าผ่านด่านตรวจมาได้ ค่อยประกอบร่างข้อมูลใหม่
      const updatedApiData = response.data;
      const fullyUpdatedPost: PostData = {
        ...postData, // ใช้ข้อมูลเก่าเป็นฐาน
        // แล้วเขียนทับด้วยข้อมูลใหม่ที่ได้กลับมา
        title: updatedApiData.title,
        description: updatedApiData.description,
        is_solved: updatedApiData.is_solved,
        post_image: updatedApiData.post_image || undefined,
        tags: response.tags, // tags อยู่นอก data
      };
      
      // 4. อัปเดต State และปิด Modal (เมื่อทุกอย่างสำเร็จ)
      setPostData(fullyUpdatedPost);
      onPostUpdate(fullyUpdatedPost);
      setIsEditModalOpen(false);

    } catch (error) {
      console.error("Failed to save post:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`Error updating post: ${errorMessage}`);
    }
  };

  // 5. สร้างฟังก์ชันสำหรับยืนยันการลบ
  const handleConfirmDelete = async () => {
    try {
      await deletePost(postData.post_id);
      setIsDeleteModalOpen(false); // ปิด Modal ก่อน
      onPostDelete(postData.post_id); // แจ้งหน้า Feed ให้ลบโพสต์นี้ออกจาก UI
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`Error deleting post: ${errorMessage}`);
    }
  };

  return (
    <>
    <div className="w-full min-h-[30vh] bg-white hover:shadow-2xl/15 rounded-2xl shadow-lg p-6 flex flex-col font-display">
      <PostHeader 
          isSolved={postData.is_solved} 
          tags={postData.tags}
          isCurrentUserAuthor={isCurrentUserAuthor}
          onEditClick={() => setIsEditModalOpen(true)}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
          onReportClick={() => setIsReportModalOpen(true)} // 3. ส่งฟังก์ชันเปิด Modal ลงไป
          postId={postData.post_id}
        />
      
      {/* ✅ Only title/description clickable */}
      <Link href={href} className="block cursor-pointer">
        <PostContent
          title={postData.title}
          description={postData.description}
          postImage={postData.post_image}
        />
      </Link>

      {/* ✅ Like/Dislike outside Link — no unwanted navigation */}
      <PostAuthor
        postId={postData.post_id}
        author={postData.author}
        stats={postData.stats}
        liked_by_user={postData.liked_by_user}
        disliked_by_user={postData.disliked_by_user}
      />

      <hr className="my-4 border-gray-200/80" />

      {postData.topComment ? (
        <TopComment comment={postData.topComment} />
      ) : (
        <p className="text-center text-sm text-gray-400">No comments yet.</p>
      )}
    </div>

    {isEditModalOpen && (
        <EditPostModal
          postToEdit={postData}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          isSaving={isUpdating}
        />
    )}

    {isDeleteModalOpen && (
        <DeletePostModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
    )}

    {/* 4. เพิ่ม Logic การแสดง Report Modal */}
      {isReportModalOpen && (
        <ReportPostModal
          postId={postData.post_id}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

    </>
  );
};

export default Post;