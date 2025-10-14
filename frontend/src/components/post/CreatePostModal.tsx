import React, { useState } from 'react';
import MultiSelectSubject from './MultiSelectSubject';
import { useCreatePost } from '@/hooks/useCreatePost';
import { PostData } from './Post'; // Make sure PostData is imported

interface ApiResponse {
  success: boolean;
  data: PostData;
  tags: string[];
}

export interface NewPostData {
  title: string;
  subjects: string[];
  details: string;
}

interface CreatePostModalProps {
  onClose: () => void;
  onPostSubmit: (apiResponse: ApiResponse) => void; 
}

const subjectOptions = [
  "Math", "Physics", "Chemistry", "Biology", "History", "Geography", 
  "Economics", "Law", "Thai", "English", "Chinese", "Programming", "Others"
];

const CreatePostModal = ({ onClose, onPostSubmit }: CreatePostModalProps) => {
  const { createPost, isCreating } = useCreatePost();
  const [title, setTitle] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    const formData: NewPostData = { title, subjects: selectedSubjects, details };

    try {
      // เรียกใช้ Hook เพื่อส่งข้อมูลไปที่ API
      const responseData = await createPost(formData);
      
      // 3. ส่ง response ที่ได้จาก API กลับไปตรงๆ เลย
      onPostSubmit(responseData); 
      onClose();

    } catch (error) {
      // Hook จะจัดการ State ของ error เอง แต่เรายังสามารถแสดง alert ที่นี่ได้
      alert(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    // Backdrop (พื้นหลัง) - ไม่มี onClick แล้ว
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-30"
    >
      {/* Modal Panel (กล่อง Pop-up สีขาว) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl"
      >
        {/* ปุ่มกากบาท (X) ที่เพิ่มเข้ามาใหม่ */}
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
          <div className="mb-9">
            <MultiSelectSubject
              options={subjectOptions}
              selected={selectedSubjects}
              onChange={setSelectedSubjects}
              limit={5}
            />
          </div>

          {/* Details Textarea */}
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
              required
            />
            <p className="text-right text-xs text-gray-400 mt-1">{details.length}/500</p>
          </div>
          
          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button 
              type="button" 
              className="flex items-center gap-2 rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              📎 Attach files/images
            </button>
            <button
              type="submit"
              disabled={isCreating} 
              className="rounded-md bg-purple-700 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 disabled:opacity-50"
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