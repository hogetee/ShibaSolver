import React, { useState } from 'react';

import ProfilePic from '@/components/profile/profile_header/ProfilePic';
import useCurrentUser from '@/hooks/useCurrentUser';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface CreateCommentProps {
  placeholder?: string;
  author?: {
    profile_picture?: string;
    display_name?: string;
  };
  onSubmit?: (text: string) => void;
}

export default function CreateComment({ placeholder = "Add a comment...", author, onSubmit }: CreateCommentProps) {
  const [comment, setComment] = useState('');
  const { user: currentUser } = useCurrentUser();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  {/*Auto-expand textarea handler*/}
  const textareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const submit = async (rawText?: string) => {
    const text = (rawText ?? comment).trim();
    if (!text) {
      setComment('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      return;
    }
    const success = await (onSubmit ? onSubmit(text) : Promise.resolve(true));
    if (success) {
      setComment('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div className="flex items-start rounded-full px-2 py-1 w-full">
      {/* Pfp */}
      <div className="w-10 h-10 mr-2 flex-shrink-0">
        <ProfilePic
          src={author?.profile_picture ?? currentUser?.profile_picture ?? '/image/DefaultAvatar.png'}
          alt={`${author?.display_name ?? currentUser?.display_name ?? 'User'}'s avatar`}
          size={40}
        />
      </div>
      {/* Input */}
      <div className="mt-1 flex-1 rounded-2xl bg-accent-200 px-2 py-1 flex items-start">
        <textarea
          className="ml-2 flex-1 outline-none text-dark-900 placeholder-dark-900/40 bg-transparent resize-none"
          placeholder={placeholder}
          value={comment}
          onChange={textareaChange}
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ maxHeight: '10rem', overflowY: 'auto' }}
        />
        {/* Arrow Button */}
        <button
          type="button"
          className={`ml-2 ${comment ? 'text-dark-900 cursor-pointer' : 'text-dark-900/40'}`}
          onClick={() => { void submit(); }}
          aria-label="Submit comment"
          disabled={!comment}
        >
          <ArrowForwardIcon />
        </button>
      </div>
      {/* Add Icon */}
      <AddCircleIcon className="mt-2 ml-2 text-dark-900 cursor-pointer" />
    </div>
  );
}
