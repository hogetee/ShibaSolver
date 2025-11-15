import React from "react";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

export default function DeleteAccountModal({ isOpen, onClose, onSuccess }) {
  const { showError, isLoading, error, handleDelete } =
    useDeleteAccount(onSuccess);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-display">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-dark-900/90" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-dark-900 rounded-lg p-8 mx-4 max-w-md w-full">
        {/* Main heading */}
        <div className="text-center mb-4">
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">
            Are Your Sure You Want To
            <br />
            Delete Your Account?
          </h2>
        </div>

        {/* Warning text */}
        <div className="text-center mb-4">
          <p className="text-white text-xl">This action is permanent.</p>
        </div>

        {/* Error message */}
        {showError && (
          <div className="text-center mb-4">
            <p className="text-red-400 text-md">
              {error || "Failed to delete account. Please try again."}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold cursor-pointer hover:bg-white hover:text-dark-900 transition-colors duration-200 flex items-center gap-2"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-xl font-bold cursor-pointer hover:bg-white hover:text-red-600 transition-colors duration-200 flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
