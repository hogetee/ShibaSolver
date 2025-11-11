'use client';

import React, { useState, useRef } from 'react';
import { PostData } from '@/components/post/Post';
import MultiSelectSubject from './MultiSelectSubject';
import { uploadImageToCloudinary } from '@/utils/uploadImage';

export interface UpdatedPostData {
  title: string;
  subjects: string[];
  details: string;
  is_solved: boolean;
  imageUrl?: string | null;
}

interface EditPostModalProps {
  postToEdit: PostData;
  onClose: () => void;
  onSave: (updatedData: UpdatedPostData) => void;
  isSaving: boolean;
}

const subjectOptions = [
  'Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography',
  'Economics', 'Law', 'Thai', 'English', 'Chinese', 'Programming', 'Others'
];

const EditPostModal = ({ postToEdit, onClose, onSave, isSaving }: EditPostModalProps) => {
  const [title, setTitle] = useState(postToEdit.title);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(postToEdit.tags || []);
  const [details, setDetails] = useState(postToEdit.description);
  const [isSolved, setIsSolved] = useState(postToEdit.is_solved);

  // 🖼️ Image state
  const [imageUrl, setImageUrl] = useState<string | null>(postToEdit.post_image || null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 📤 Upload image
  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFileName(file.name);
    setUploading(true);

    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
      // safely reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

// ❌ Remove image
const handleRemoveImage = () => {
  setImageUrl(null);
  setImageFileName('');
  if (fileInputRef.current) fileInputRef.current.value = '';
  // force rerender by also clearing post image reference
  postToEdit.post_image = '';
};

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // เคลียร์ Error เก่า

    // --- ตรวจสอบ Title ---
    if (title.trim().length === 0) {
      setError("Please enter a title.");
      return;
    }
    
    // --- ตรวจสอบ Subjects ---
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject.");
      return;
    }

    // --- ตรวจสอบ Details ---
    if (details.trim().length === 0) {
      setError("Please enter the details.");
      return;
    }

    const updatedData: UpdatedPostData = {
      title,
      subjects: selectedSubjects,
      details,
      is_solved: isSolved,
      imageUrl: imageUrl || null,
    };

    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl"
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

        <h2 className="text-3xl font-bold mb-6">Edit Post</h2>

        <form onSubmit={handleSave}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{title.length}/100</p>
          </div>

          {/* Subjects */}
          <div className="mb-9">
            <MultiSelectSubject
              options={subjectOptions}
              selected={selectedSubjects}
              onChange={setSelectedSubjects}
              limit={5}
            />
          </div>

          {/* Details */}
          <div className="mb-4">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              maxLength={500}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{details.length}/500</p>
          </div>

          {/* 🖼️ Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach image</label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="edit-file-upload"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-2 cursor-pointer rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                📎 {uploading ? 'Uploading…' : 'Choose file'}
              </label>

              <input
                id="edit-file-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onPickFile}
                disabled={uploading}
                className="hidden"
              />

              {imageFileName && !uploading && (
                <span className="text-sm text-gray-500">{imageFileName}</span>
              )}
            </div>

            {imageUrl && imageUrl.trim() !== '' && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="max-h-48 rounded-md border border-gray-300 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={isSolved}
                  onChange={() => setIsSolved(true)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span>Solved</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={!isSolved}
                  onChange={() => setIsSolved(false)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span>Unsolved</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-m font-medium">
              {error}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSaving || uploading}
              className="rounded-md bg-purple-700 px-8 py-2 font-semibold text-white shadow-sm hover:bg-purple-600 disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;