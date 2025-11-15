import React, { useState } from 'react';
import { ReplyItemProps, CommentContent } from './types';
import { useCommentActions } from './useCommentActions';
import { formatTimeAgo } from './utils';
import useCurrentUser from '@/hooks/useCurrentUser';

import { LikeButton } from './LikeButton';
import { DislikeButton } from './DislikeButton';
import { MoreActionsMenu } from './MoreActionsMenu';
import { SolutionTag } from './SolutionTag';
import CommentContentDisplay from './CommentContent';
import CommentEditor from './CommentEditor';
import ReportCommentModal from '@/components/comment/ReportCommentModal';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme';

export const ReplyItem: React.FC<ReplyItemProps> = ({ 
  reply, 
  onDelete, 
  level = 1 
}) => {
  const { user, isLoading } = useCurrentUser();
  const isOwner = user?.user_id == reply.author.user_id;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const initialContent: CommentContent = {
    text: reply.text,
    image: reply.comment_image !== "null" && reply.comment_image ? reply.comment_image : null,
  };

  const {
    likes,
    dislikes,
    userLikeStatus,
    anchorEl,
    isSolution,
    isEditing,
    displayContent,
    isDeleteModalOpen,
    toggleLike,
    toggleDislike,
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
    reply.id,
    reply.likes,
    reply.dislikes,
    reply.is_solution,
    onDelete,
    "none",
    initialContent
  );

  const handleReportModalOpen = () => {
    setIsReportModalOpen(true);
  };
  const handleReportModalClose = () => {
    setIsReportModalOpen(false);
  };

  // Calculate indentation (max 3 levels to prevent too much nesting)
  const maxLevel = 3;
  const currentLevel = Math.min(level, maxLevel);
  const indentWidth = currentLevel * 24; // 24px per level

  return (
    <div className="relative font-display">
      {/* Threading line */}
      <div 
        className="absolute left-0 top-0 h-full border-l-2 border-gray-200"
        style={{ marginLeft: `${Math.max(0, indentWidth - 12)}px` }}
      />
      
      <div 
        className="flex items-start gap-3 py-2 relative"
        style={{ marginLeft: `${indentWidth}px` }}
      >
        {/* Profile picture */}
        <img
          src={reply.author.profile_picture}
          alt={`${reply.author.display_name}'s avatar`}
          className="w-8 h-8 rounded-full flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = "/image/DefaultAvatar.png";
          }}
        />

        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-dark-800">
                {reply.author.display_name || "Anonymous"}
              </span>
              <span className="text-dark-500">
                {formatTimeAgo(reply.created_at)}
              </span>
              {reply.is_edited && (
                <span className="text-xs text-dark-400 italic">(edited)</span>
              )}
            </div>

            {/* Solution tag and actions */}
            <div className="flex items-center gap-2">
              {isSolution && <SolutionTag />}
            </div>
          </div>

          {/* Content */}
          <div className="mt-1">
            {isEditing ? (
              <CommentEditor
                initialContent={displayContent || { text: "", image: null }}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <CommentContentDisplay content={displayContent || { text: "", image: null }} />
            )}
          </div>

          {/* Action buttons */}
          {!isEditing && (
            <div className="flex items-center gap-4 mt-2">
              <LikeButton
                count={likes}
                userStatus={userLikeStatus}
                onClick={toggleLike}
              />
              <DislikeButton
                count={dislikes}
                userStatus={userLikeStatus}
                onClick={toggleDislike}
              />
              {/* More Actions Menu - available for all users */}
              {!isLoading && (
                <MoreActionsMenu
                  anchorEl={anchorEl}
                  handleMenuOpen={handleMenuOpen}
                  handleMenuClose={handleMenuClose}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleSetSolution={handleSetSolution}
                  handleDeleteModalOpen={handleDeleteModalOpen}
                  handleDeleteModalClose={handleDeleteModalClose}
                  owner={isOwner}
                  handleReportClick={handleReportModalOpen}
                />
              )}
            </div>
          )}

          {/* Reply input */}
          {/* Removed ReplyButton as per edit hint */}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ThemeProvider theme={theme}>
        <Dialog
          open={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          aria-labelledby="delete-reply-dialog-title"
        >
          <DialogTitle id="delete-reply-dialog-title">
            Delete Reply
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete this reply? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteModalClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>

      {/* Report Modal */}
      {isReportModalOpen && (
        <ReportCommentModal
          commentId={String(reply.id)} 
          onClose={handleReportModalClose}
        />
      )}
    </div>
  );
};