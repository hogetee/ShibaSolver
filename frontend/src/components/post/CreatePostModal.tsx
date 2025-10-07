import React, { useState } from 'react';
import MultiSelectSubject from './MultiSelectSubject';
import { PostData } from '@/components/post/Post';

export interface NewPostData {
  title: string;
  subjects: string[];
  details: string;
}

interface CreatePostModalProps {
  onClose: () => void;
  onPostSubmit: (newPost: PostData) => void;
}

const subjectOptions = [
  "Math", "Physics", "Chemistry", "Biology", "History", "Geography", 
  "Economics", "Law", "Thai", "English", "Chinese", "Programming", "Others"
];

const CreatePostModal = ({ onClose, onPostSubmit }: CreatePostModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      title: title,
      description: details,
      tags: selectedSubjects,
      post_image: null 
    };

    try {
      const response = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer YOUR_AUTH_TOKEN` 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const responseData = await response.json();

      const createdPost: PostData = {
        ...responseData.data,
        tags: responseData.tags,
      };
      
      onPostSubmit(createdPost);
      onClose();

    } catch (error) {
  console.error("Failed to create post:", error);
  let errorMessage = "An unexpected error occurred.";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  alert(`Failed to create post: ${errorMessage}`);
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-30">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl"
      >
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
          {/* Title Input */}
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
              required
            />
            <p className="text-right text-xs text-gray-400 mt-1">{title.length}/100</p>
          </div>

          {/* Subject Select */}
          <div className="mb-4">
            <label htmlFor="subject-multiselect" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <MultiSelectSubject
              options={subjectOptions}
              selected={selectedSubjects}
              onChange={setSelectedSubjects}
              limit={5}
            />
          </div>

          {/* Details Textarea */}
          <div className="mb-4">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Write your details here..."
              rows={5}
              maxLength={500}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
              required
            />
            <p className="text-right text-xs text-gray-400 mt-1">{details.length}/500</p>
          </div>
          
          {/* Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button 
              type="button" 
              className="flex items-center gap-2 rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              📎 Attach files/images
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-purple-700 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;