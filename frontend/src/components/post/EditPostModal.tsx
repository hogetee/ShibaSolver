import React, { useState } from 'react';
import { PostData } from '@/components/post/Post';
import MultiSelectSubject from './MultiSelectSubject'; // 1. Import MultiSelectSubject

// 2. อัปเดต Interface ให้รับเป็น subjects (Array)
export interface UpdatedPostData {
  title: string;
  subjects: string[]; 
  details: string;
  is_solved: boolean;
}

interface EditPostModalProps {
  postToEdit: PostData;
  onClose: () => void;
  onSave: (updatedData: UpdatedPostData) => void;
  isSaving: boolean;
}

const subjectOptions = [
  "Math", "Physics", "Chemistry", "Biology", "History", "Geography", 
  "Economics", "Law", "Thai", "English", "Chinese", "Programming", "Others"
];

const EditPostModal = ({ postToEdit, onClose, onSave, isSaving }: EditPostModalProps) => {
  const [title, setTitle] = useState(postToEdit.title);
  // 3. เปลี่ยน State ของ Subject ให้เป็น Array
  const [selectedSubjects, setSelectedSubjects] = useState(postToEdit.tags || []);
  const [details, setDetails] = useState(postToEdit.description);
  const [isSolved, setIsSolved] = useState(postToEdit.is_solved);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }
    const updatedData: UpdatedPostData = {
      title,
      subjects: selectedSubjects, // 4. ส่งข้อมูลเป็น Array
      details,
      is_solved: isSolved,
    };
    onSave(updatedData);
  };

  return (
    // Backdrop & Modal Card - ใช้สไตล์เดียวกับ CreatePostModal
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-30">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl"
      >
        {/* ปุ่มปิด (X) - เหมือนกับ CreatePostModal */}
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
          {/* Title Input - เพิ่ม Character Counter */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {/* Details Textarea - เพิ่ม Character Counter */}
          <div className="mb-4">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              maxLength={500}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2"
              required
            />
             <p className="text-right text-xs text-gray-400 mt-1">{details.length}/500</p>
          </div>

          {/* Status Radio Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked={isSolved} onChange={() => setIsSolved(true)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <span>Solved</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked={!isSolved} onChange={() => setIsSolved(false)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <span>Unsolved</span>
              </label>
            </div>
          </div>
          
          {/* Buttons - ปรับ Layout ให้เหมือนกัน */}
          <div className="flex items-center justify-between mt-6">
            <button 
              type="button" 
              className="flex items-center gap-2 rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              📎 Attach files/images
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md bg-purple-700 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;