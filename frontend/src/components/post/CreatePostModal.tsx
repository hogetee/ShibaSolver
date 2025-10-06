import React, { useState } from 'react';
import MultiSelectSubject from './MultiSelectSubject'; //  <--- 1. Import component ใหม่

//  <--- 2. อัปเดต Interface
export interface NewPostData {
  title: string;
  subjects: string[]; // เปลี่ยนจาก subject (string) เป็น subjects (array of strings)
  details: string;
}

interface CreatePostModalProps {
  onClose: () => void;
  onPostSubmit: (data: NewPostData) => void;
}

//  <--- 3. สร้าง Array ของวิชา
const subjectOptions = [
  "Math", "Physics", "Chemistry", "Biology", "History", "Geography", 
  "Economics", "Law", "Thai", "English", "Chinese", "Programming", "Others"
];

const CreatePostModal = ({ onClose, onPostSubmit }: CreatePostModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]); //  <--- 4. เปลี่ยน State
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) { //  <--- 5. อัปเดตเงื่อนไข
      alert("Please select at least one subject.");
      return;
    }
    setIsSubmitting(true);
    const newPostData: NewPostData = { title, subjects: selectedSubjects, details }; //  <--- 6. อัปเดตข้อมูลที่จะส่ง
    await new Promise(resolve => setTimeout(resolve, 1000));
    onPostSubmit(newPostData);
    setIsSubmitting(false);
    onClose(); 
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl bg-white p-8 shadow-xl"
      >
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

          {/* Subject Select (ส่วนที่แก้ไข) */}
          <div className="mb-4">
             {/* <--- 7. แทนที่ <select> ด้วย Component ใหม่ */}
            <MultiSelectSubject
              options={subjectOptions}
              selected={selectedSubjects}
              onChange={setSelectedSubjects}
              limit={5}
            />
          </div>

          {/* ... Details Textarea and Buttons ... */}
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
          <div className="flex items-center justify-between">
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