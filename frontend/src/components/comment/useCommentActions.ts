import { useState } from "react";

import { CommentContent, UserLikeStatus } from "@/components/comment/types";
import { CommentActions } from "@/components/comment/types";

export const useCommentActions = (
  commentId: string,
  initialLikes: number,
  initialDislikes: number,
  initialSolution: boolean,
  onDelete?: (commentId: string) => void,
  initialUserStatus: UserLikeStatus = "none",
  initialContent?: CommentContent
): CommentActions => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userLikeStatus, setUserLikeStatus] = useState(initialUserStatus);

    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isSolution, setIsSolution] = useState(initialSolution);
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [attachedImagePreview, setAttachedImagePreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState<CommentContent | null>(null);
  const [displayContent, setDisplayContent] = useState<CommentContent | null>(
    initialContent || null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const BASE_URL = process.env.BACKEND_URL || "http://localhost:5003";

  async function postRate(
    target_type: "post" | "comment",
    target_id: number | string,
    rating_type: "like" | "dislike"
  ) {
    try {
      const res = await fetch("http://localhost:5003/api/v1/ratings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type,
          target_id: Number(target_id),
          rating_type,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("User not authenticated");
        }
        throw new Error(`POST /ratings failed: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("Error posting rating:", err);
      throw err;
    }
  }

  async function deleteRate(
    target_type: "post" | "comment",
    target_id: number | string
  ) {
    try {
      const res = await fetch("http://localhost:5003/api/v1/ratings", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type,
          target_id: Number(target_id),
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("User not authenticated");
        }
        throw new Error(`DELETE /ratings failed: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("Error deleting rating:", err);
      throw err;
    }
  }

  // ---- Optimistic + Accurate Like Toggle ----
  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    const prev = { liked, disliked, likes, dislikes };

    // optimistic UI update
    if (liked) {
      setUserLikeStatus("none");
      setLiked(false);
      setLikes((l) => Math.max(0, l - 1));
    } else {
      setUserLikeStatus("liked");
      setLiked(true);
      setLikes((l) => l + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes((d) => Math.max(0, d - 1));
      }
    }

    try {
      const json = liked
        ? await deleteRate("comment", commentId)
        : await postRate("comment", commentId, "like");

      // --- sync back with backend response ---
      const summary = json?.data?.summary ?? json?.summary;
      const rating = json?.data?.rating ?? json?.rating;
      const my_rating = rating?.rating_type ?? json?.data?.my_rating;

      if (summary) {
        setLikes(Number(summary.likes));
        setDislikes(Number(summary.dislikes));
      }

      if (my_rating) {
        setLiked(my_rating === "like");
        setDisliked(my_rating === "dislike");
      }
    } catch (err) {
      // rollback on error
      setLiked(prev.liked);
      setDisliked(prev.disliked);
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
    } finally {
      setLoading(false);
    }
  };

  // ---- Optimistic + Accurate Dislike Toggle ----
  const toggleDislike = async () => {
    if (loading) return;
    setLoading(true);

    const prev = { liked, disliked, likes, dislikes };

    // optimistic UI update
    if (disliked) {
      setUserLikeStatus("none");
      setDisliked(false);
      setDislikes((d) => Math.max(0, d - 1));
    } else {
      setUserLikeStatus("disliked");
      setDisliked(true);
      setDislikes((d) => d + 1);
      if (liked) {
        setLiked(false);
        setLikes((l) => Math.max(0, l - 1));
      }
    }

    try {
      const json = disliked
        ? await deleteRate("comment", commentId)
        : await postRate("comment", commentId, "dislike");

      const summary = json?.data?.summary ?? json?.summary;
      const rating = json?.data?.rating ?? json?.rating;
      const my_rating = rating?.rating_type ?? json?.data?.my_rating;

      if (summary) {
        setLikes(Number(summary.likes));
        setDislikes(Number(summary.dislikes));
      }

      if (my_rating) {
        setLiked(my_rating === "like");
        setDisliked(my_rating === "dislike");
      }
    } catch (err) {
      // rollback on error
      setLiked(prev.liked);
      setDisliked(prev.disliked);
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReplies = () => {
    setIsRepliesOpen((prev) => !prev);
    if (!isRepliesOpen) {
      console.log(`[ACTION] Fetching replies for comment ID: ${commentId}`);
    }
  };

  const handleToggleNewReply = () => {
    setIsReplying((prev) => !prev);
  };

  const handleAttachImage = async (file: File | null) => {
    try {
      if (!file) {
        // clear
        if (attachedImagePreview) {
            URL.revokeObjectURL(attachedImagePreview);
        }
        setAttachedImage(null);
        setAttachedImagePreview(null);
        return null;
      }
      // revoke previous if any
      if (attachedImagePreview) {
          URL.revokeObjectURL(attachedImagePreview);
      }
      // create preview URL
      const preview = URL.createObjectURL(file);
      setAttachedImage(file);
      setAttachedImagePreview(preview);
      return preview;
    } catch (err) {
        console.error('Failed to attach image', err);
        return null;
    }
  };

    const handleRemoveAttachment = () => {
        if (attachedImagePreview) {
            URL.revokeObjectURL(attachedImagePreview);
        }
        setAttachedImage(null);
        setAttachedImagePreview(null);
    };

  const handleCreateNewReply = async (replyText: string, attachment: File | null = null) => {
    const commentNumericId = Number(commentId);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/comments/${commentNumericId}/replies`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: replyText }),
        }
      );
      if (!res.ok) throw new Error("Failed to create reply");
      // Optionally update local UI or refetch replies here
            setIsReplying(false);
            if (!isRepliesOpen) setIsRepliesOpen(true);
            // Clear attachment after success
            if (attachedImage || attachment) {
                handleRemoveAttachment();
            }
            return true;
        } catch (err) {
            console.error("Failed to create reply", err);
            return false;
        }
    };

    const handleCreateNewComment = async (commentText: string, attachment: File | null = null) => {
        // Simulate creating a comment. In a real app you'd POST to an API.
    try {
      console.log(`[ACTION] create comment for ${commentId}:`, commentText);
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 200));
      // Clear local attachment state after success
      if (attachedImage || attachment) {
          handleRemoveAttachment();
      }
      return true;
    } catch (err) {
      console.error("Failed to create comment", err);
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
    console.log(`[ACTION] Editing comment ID: ${commentId}`);
    console.log(`[ACTION] Current displayContent:`, displayContent);
    setIsEditing(true);
    setDraftContent(displayContent || { text: "", image: null });
    handleMenuClose();
    console.log(`[ACTION] Set isEditing to true for comment ID: ${commentId}`);
  };

  const handleSaveEdit = async (newContent: CommentContent) => {
    try {
      console.log(`Saving edit for ID ${commentId}:`, newContent);

      const requestBody = {
        text: newContent.text,
        image_url: newContent.image || null,
      };

      const res = await fetch(
        `${BASE_URL}/api/v1/comments/${Number(commentId)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
          "Content-Type": "application/json", // Add this missing header
        },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        console.error("Edit failed:", res.status, res.statusText);
        throw new Error(`Failed to save edit: ${res.status}`);
      }
      // if (!res.ok) {
      //   const errorText = await res.text();
      //   console.error("Edit failed:", res.status, errorText);
      //   throw new Error(`Failed to save edit: ${res.status}`);
      // }

      const response = await res.json();
      console.log("Backend response:", response);

      const updatedCommentData = response.data;

      const updatedComment: CommentContent = {
        text: updatedCommentData.text,
        image:
          updatedCommentData.comment_image &&
          updatedCommentData.comment_image !== "null"
            ? updatedCommentData.comment_image
            : null,
      };

      setDisplayContent(updatedComment);
      setDraftContent(null);
      setIsEditing(false);
      console.log(
        `[ACTION] Saved edited content for comment ID: ${commentId}`,
        updatedComment
      );
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraftContent(null);
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    handleMenuClose();
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/comments/${Number(commentId)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      // Optionally: notify parent to remove this comment from the list
      if (onDelete) {
        onDelete(commentId);
      }

      setIsDeleteModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };
  const handleSetSolution = async () => {
    handleMenuClose();
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/comments/${Number(commentId)}/solution`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to toggle solution");
      const payload = await res.json();
      const newVal = Boolean(payload?.data?.is_solution);
      setIsSolution(newVal);
    } catch (e) {
      console.error(e);
    }
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
    toggleLike,
    toggleDislike,
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
};
