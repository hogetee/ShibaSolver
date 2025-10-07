import React, { useState } from 'react';

import Avatar from '@/components/profile/profile_header/ProfilePic'; // Adjust path if needed
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface CreateCommentProps {
  placeholder?: string;
}

export default function CreateComment({ placeholder = "Add a comment..." }: CreateCommentProps) {
  const [comment, setComment] = useState('');

  {/*Auto-expand textarea handler*/}
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className="flex items-start rounded-full px-2 py-1 w-full">
      {/* Pfp */}
      <div className="w-10 h-10 mr-2 flex-shrink-0">
        <Avatar src="/image/DefaultAvatar.png" size={40} />
      </div>
      {/* Input */}
      <div className="mt-1 flex-1 rounded-2xl bg-accent-200 px-2 py-1 flex items-start">
        <textarea
          className="ml-2 flex-1 outline-none text-dark-900 placeholder-dark-900/40 bg-transparent resize-none"
          placeholder={placeholder}
          value={comment}
          onChange={handleChange}
          rows={1}
          style={{ maxHeight: '10rem', overflowY: 'auto' }}
        />
        {/* Arrow Button */}
        <button
          className={`ml-2 ${comment ? 'text-dark-900 cursor-pointer' : 'text-dark-900/40'}`}
          onClick={() => comment && console.log(comment)}
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
