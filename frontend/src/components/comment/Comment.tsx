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
import useCurrentUser from "@/hooks/useCurrentUser";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme/theme";
import CreateComment from "./CreateComment";


const Comment = ({ commentData }: CommentProps) => {
  const hasReplies = commentData.Replies > 0;
  const { user: currentUser } = useCurrentUser();

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
    commentData.is_solution
  );
  const [replyText, setReplyText] = React.useState("");
  return (
    <div>
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
          <div className="flex items-baseline justify-between">
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
              content={draftContent ? draftContent : { text: commentData.text }}
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
              </div>
            </div>
          </div>
          {/* Reply Input Section: Opened by ReplyButton */}
          {isReplying && (
            <div className="w-full bg-white hover:shadow-2xl/15 rounded-2xl shadow-lg p-3 flex flex-col font-display mt-5">
            {/* Create Reply component */}
            <CreateComment
                placeholder="Add your reply..."
                author={currentUser ? {
                    profile_picture: currentUser.profile_picture ?? undefined,
                    display_name: currentUser.display_name ?? undefined,
                } : undefined}
                onSubmit={(text, attachment) => handleCreateNewReply(text, attachment)}
            />
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
            <DialogTitle id="delete-dialog-title" className="text-xl">Delete Comment</DialogTitle>
            <DialogContent>
              <p
                id="delete-dialog-description"
                className="text-center font-display text-xl"
              >
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </p>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteModalClose}
                color="primary"
                size="large"
                variant="outlined"
                sx={{ fontSize: 24 , padding: '8px 24px' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                autoFocus
                size="large"
                variant="outlined"
                sx={{ fontSize: 24 , padding: '8px 24px' }}
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