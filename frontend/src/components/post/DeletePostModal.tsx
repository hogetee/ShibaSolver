import React from 'react';

interface DeletePostModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeletePostModal = ({ onClose, onConfirm, isDeleting }: DeletePostModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50">
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
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
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 bg-white font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          
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