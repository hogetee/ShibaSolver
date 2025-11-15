import React from 'react';

interface CreatePostButtonProps {
  onClick: () => void;
}

const CreatePostButton = ({ onClick }: CreatePostButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#4B0082] text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Create new post"
      data-testid="create-post-button"
    >
      <span className="text-4xl">+</span>
    </button>
  );
};

export default CreatePostButton;