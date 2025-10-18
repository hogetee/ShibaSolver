import React from 'react';
import { ViewRepliesButtonProps } from './types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const ViewRepliesButton: React.FC<ViewRepliesButtonProps> = ({
  replyCount,
  isOpen,
  onClick,
}) => {
  // Don't show button if no replies

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-accent-600/75 hover:text-accent-600 transition-colors duration-200 mt-2 font-medium cursor-pointer"
      aria-label={isOpen ? 'Hide replies' : 'View replies'}
    >
      {isOpen ? (
        <>
          <ExpandLessIcon fontSize="small" />
          <span>Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
        </>
      ) : (
        <>
          <ExpandMoreIcon fontSize="small" />
          <span>View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
        </>
      )}
    </button>
  );
};