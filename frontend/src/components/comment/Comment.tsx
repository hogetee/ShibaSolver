import React from "react";
import { CommentProps } from "./types";
import { useCommentActions } from "@/components/comment/useCommentActions";
import { formatTimeAgo } from "@/components/comment/utils";

import { LikeButton } from "@/components/comment/LikeButton";
import { DislikeButton } from "@/components/comment/DislikeButton";
import { ReplyButton } from "@/components/comment/ReplyButton";
import { MoreActionsMenu } from "@/components/comment/MoreActionsMenu";
import { SolutionTag } from "./SolutionTag";
import CommentContent from "./CommentContent";
import CommentEditor from "./CommentEditor";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import useCurrentUser from "@/hooks/useCurrentUser";

const Comment = ({ commentData,onDelete }: CommentProps) => {
  const hasReplies = commentData.Replies > 0;
  const { user, isLoading, error, refetch } = useCurrentUser();

  const isOwner = (user?.user_id == commentData.author.user_id);

  const {
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
  } = useCommentActions(
    commentData.id,
    commentData.likes,
    commentData.dislikes,
    commentData.is_solution,
    onDelete
  );
  const [replyText, setReplyText] = React.useState("");
  return (
    <div>
      {/* for debugging */}
      {/* <div style={{ fontSize: '10px', color: 'red' }}>
        Debug: currentUser={user?.user_id}, author={commentData.author.user_id}, isOwner={String(isOwner)}, loading={String(isLoading)}
      </div> */}

      <div className="flex items-start gap-3 relative font-display">
        {hasReplies && (
          <div className="absolute left-5 top-12 h-18 border-l-2 border-black"></div>
        )}
        <img
          src={commentData.author.profile_picture || "/image/DefaultAvatar.png"}
          alt={`${commentData.author.display_name}'s avatar`}
          className="w-10 h-10 rounded-full"
          onError={(e) => {
            e.currentTarget.src = "/image/DefaultAvatar.png";
          }}
        />

        <div className="flex-grow">
          {/* Header and Text Content */}
          <div className="flex items-start justify-between">
            <div className="flex items-baseline  gap-3">
              <span
                className="font-semibold text-xl"
                style={{ color: "var(--color-accent-400)" }}
              >
                {commentData.author.display_name}
              </span>
              <span className="text-base text-gray-400">
                {formatTimeAgo(commentData.created_at)}
              </span>
            </div>
            {isSolution && <SolutionTag />}
          </div>
          {isEditing ? (
            <CommentEditor
              initialContent={
                displayContent ? displayContent : { text: commentData.text }
              }
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <CommentContent
              content={displayContent ? displayContent : { text: commentData.text }}
            />
          )}
          {/* turn the other one into input */}
          {/* ACTION ROW (Using individual imported components) */}
          <div className="flex items-center justify-between text-gray-500">
            <div className="flex items-center gap-3 text-gray-500">
              {/* 1. Like Button */}
              <LikeButton
                count={likes}
                userStatus={userLikeStatus}
                onClick={toggleLike}
              />

              {/* 2. Dislike Button */}
              <DislikeButton
                count={dislikes}
                userStatus={userLikeStatus}
                onClick={toggleDislike}
              />
              <div className="flex items-center gap-7">
                {/* 3. Reply Button */}
                <ReplyButton
                  isReplying={isReplying}
                  onClick={handleToggleNewReply}
                />

                {/* 4. More Actions Menu */}
                {!isLoading && isOwner && (
                  <MoreActionsMenu
                    anchorEl={anchorEl}
                    handleMenuOpen={handleMenuOpen}
                    handleMenuClose={handleMenuClose}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleSetSolution={handleSetSolution}
                    handleDeleteModalOpen={handleDeleteModalOpen}
                    handleDeleteModalClose={handleDeleteModalClose}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Reply Input Section: Opened by ReplyButton */}
          {isReplying && (
            <div className="mt-4 ">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                <input
                  type="text"
                  placeholder="Write your reply..."
                  className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-800"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setReplyText("");
                    handleCancelReply();
                  }}
                  className="text-sm px-3 py-1 text-accent-600 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const ok = await handleCreateNewReply(replyText);
                    if (ok) setReplyText("");
                  }}
                  disabled={!replyText.trim()}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded-full"
                >
                  Reply
                </button>
              </div>
            </div>
          )}
          {/* Replies Section: Opened by View Replies Toggle */}
          {isRepliesOpen && (
            <div className="mt-4 relative pl-8 ">
              {isRepliesOpen && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-13 h-px bg-black"></div>
              )}
              <p className="text-gray-500 italic">
                ...Replies will be displayed here...
              </p>
            </div>
          )}

          {/* View Replies Toggle */}
          {hasReplies && (
            <div className="mt-4 relative pl-8">
              {!isRepliesOpen && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-13 h-px bg-black"></div>
              )}
              <button
                className="text-purple-300 hover:text-blue-700 font-semibold text-sm"
                onClick={handleToggleReplies}
              >
                {isRepliesOpen
                  ? "Hide replies"
                  : `View ${commentData.Replies} replies`}
              </button>
            </div>
          )}
        </div>
      </div>

      {isDeleteModalOpen && (
        <ThemeProvider theme={theme}>
          <Dialog
            open={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title" className="text-xl">
              Delete Comment
            </DialogTitle>
            <DialogContent>
              <p
                id="delete-dialog-description"
                className="text-center font-display text-xl"
              >
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </p>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-evenly", padding: "16px 24px", gap: 2 }}>
              <Button
                onClick={handleDeleteModalClose}
                color="primary"
                size="large"
                variant="contained"
                disableElevation
                sx={{ fontSize: 24, padding: "8px 24px" , minWidth: '10ch'}}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                autoFocus
                size="large"
                variant="contained"
                disableElevation
                sx={{ fontSize: 24, padding: "8px 24px", minWidth: '10ch' }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
      )}
    </div>
  );
};

export default Comment;
