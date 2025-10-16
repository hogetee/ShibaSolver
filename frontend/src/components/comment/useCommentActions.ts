import { useState } from "react";

import { CommentContent, UserLikeStatus } from "@/components/comment/types";
import { CommentActions } from "@/components/comment/types";

export const useCommentActions = (
  commentId: string,
  initialLikes: number,
  initialDislikes: number,
  initialSolution: boolean,
  initialUserStatus: UserLikeStatus = "none"
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
  const [displayContent, setDisplayContent] = useState<CommentContent | null>(
    null
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";

  const handleLike = async () => {
    const commentNumericId = Number(commentId);
    const prev = { likes, dislikes, userLikeStatus };

    try {
      if (userLikeStatus === "liked") {
        // unrate
        setLikes((prev) => prev - 1);
        setUserLikeStatus("none");

        const res = await fetch(`${BASE_URL}/api/v1/ratings`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_type: "comment",
            target_id: commentNumericId,
          }),
        });
        if (!res.ok) throw new Error("Failed to unrate");
        const payload = await res.json();
        setLikes(Number(payload?.summary?.likes ?? likes));
        setDislikes(Number(payload?.summary?.dislikes ?? dislikes));
      } else {
        // rate like
        if (userLikeStatus === "disliked") setDislikes((d) => d - 1);
        setLikes((l) => l + 1);
        setUserLikeStatus("liked");

        const res = await fetch(`${BASE_URL}/api/v1/ratings`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_type: "comment",
            target_id: commentNumericId,
            rating_type: "like",
          }),
        });
        if (!res.ok) throw new Error("Failed to like");
        const payload = await res.json();
        setLikes(Number(payload?.data?.summary?.likes ?? likes));
        setDislikes(Number(payload?.data?.summary?.dislikes ?? dislikes));
      }
    } catch (e) {
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
      setUserLikeStatus(prev.userLikeStatus);
      console.error(e);
    }
    // In a real app, you'd send an API request here
  };

  const handleDislike = async () => {
    const commentNumericId = Number(commentId);
    const prev = { likes, dislikes, userLikeStatus };

    try {
      if (userLikeStatus === "disliked") {
        // unrate
        setDislikes((d) => d - 1);
        setUserLikeStatus("none");

        const res = await fetch(`${BASE_URL}/api/v1/ratings`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_type: "comment",
            target_id: commentNumericId,
          }),
        });
        if (!res.ok) throw new Error("Failed to unrate");
        const payload = await res.json();
        setLikes(Number(payload?.summary?.likes ?? likes));
        setDislikes(Number(payload?.summary?.dislikes ?? dislikes));
      } else {
        // rate dislike
        if (userLikeStatus === "liked") setLikes((l) => l - 1);
        setDislikes((d) => d + 1);
        setUserLikeStatus("disliked");

        const res = await fetch(`${BASE_URL}/api/v1/ratings`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_type: "comment",
            target_id: commentNumericId,
            rating_type: "dislike",
          }),
        });
        if (!res.ok) throw new Error("Failed to dislike");
        const payload = await res.json();
        setLikes(Number(payload?.data?.summary?.likes ?? likes));
        setDislikes(Number(payload?.data?.summary?.dislikes ?? dislikes));
      }
    } catch (e) {
      setLikes(prev.likes);
      setDislikes(prev.dislikes);
      setUserLikeStatus(prev.userLikeStatus);
      console.error(e);
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

  const handleCreateNewReply = async (replyText: string) => {
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
      return true;
    } catch (err) {
      console.error("Failed to create reply", err);
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
    setIsEditing(true);
    setDraftContent(displayContent || { text: "" });
    handleMenuClose();
  };

  const handleSaveEdit = async (newContent: CommentContent) => {
    try {
      console.log("Saving edit: ", newContent);

      const res = await fetch(
        `${BASE_URL}/api/v1/comments/${Number(commentId)}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newContent.text }),
        }
      );
      if (!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save edit");
      }

      const updatedComment = await res.json();

      setDisplayContent(updatedComment);
      setDraftContent(updatedComment);
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
};
