import React from 'react';

interface DeletePostModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeletePostModal = ({ onClose, onConfirm, isDeleting }: DeletePostModalProps) => {
  return (
    <div className="font-display fixed inset-0 z-50 flex min-h-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50">
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-3xl font-bold mb-4">Delete Post</h2>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this post?
        </p>
        
        <p className="text-red-600 font-medium mb-6">
          You will not be able to recover the content of the post, including images, attachments, and comments.
        </p>
        
        {/* Buttons */}
        <div className="flex items-center justify-end gap-4"> 
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;