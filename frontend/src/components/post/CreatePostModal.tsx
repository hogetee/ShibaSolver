import React, { useState, useRef } from 'react';
import MultiSelectSubject from './MultiSelectSubject';
import { useCreatePost } from '@/hooks/useCreatePost';
import { PostData } from './Post';

interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

export interface NewPostData {
  title: string;
  subjects: string[];
  details: string;
  imageUrl?: string | null;
}

interface CreatePostModalProps {
  onClose: () => void;
  onPostSubmit: (apiResponse: ApiResponse) => void;
}

const subjectOptions = [
  "Math", "Physics", "Chemistry", "Biology", "History", "Geography",
  "Economics", "Law", "Thai", "English", "Chinese", "Programming", "Others"
];

const CLOUD_NAME = "dkhggwcub";
const UPLOAD_PRESET = "unsigned_preset";

const CreatePostModal = ({ onClose, onPostSubmit }: CreatePostModalProps) => {
  const { createPost, isCreating } = useCreatePost();
  const [title, setTitle] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [details, setDetails] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // เคลียร์ Error เก่าทุกครั้งที่กด

    // --- 1. ตรวจสอบ Title ---
    if (title.trim().length === 0) {
      setError("Please enter a title.");
      return; // หยุดทำงาน
    }

    // --- 2. ตรวจสอบ Subjects ---
    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject.");
      return; // หยุดทำงาน
    }

    // --- 3. ตรวจสอบ Details ---
    if (details.trim().length === 0) {
      setError("Please enter the details.");
      return; // หยุดทำงาน
    }

    const formData: NewPostData = {
      title,
      subjects: selectedSubjects,
      details,
      imageUrl: imageUrl || null, 
    };

    try {
      const responseData = await createPost(formData);
      onPostSubmit(responseData);
      onClose();
    } catch (error) {
      alert(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center backdrop-blur-sm backdrop-brightness-50">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">
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

        <h2 className="text-3xl font-bold mb-6">Create Post</h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your title here..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
              maxLength={100}
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
          <div className="mb-6">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Write your details here..."
              rows={5}
              maxLength={500}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{details.length}/500</p>
          </div>

          {/* Image Upload (Button style) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach image</label>

            <div className="flex items-center gap-3">
              {/* The visible "button" */}
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center gap-2 cursor-pointer rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                📎 {uploading ? 'Uploading...' : 'Choose file'}
              </label>

              {/* The hidden input */}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {/* Optional: show selected file name */}
            {imageFile && !uploading && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: <span className="font-medium">{imageFile.name}</span>
              </p>
            )}

            {/* Optional: show preview
            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="max-h-48 rounded-md border border-gray-300 shadow-sm"
                />
              </div>
            )} */}
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-m font-medium">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isCreating || uploading}
              className="rounded-md bg-purple-700 px-8 py-2 font-semibold text-white shadow-sm hover:bg-purple-600 disabled:opacity-50"
            >
              {isCreating ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;