'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Bookmark,
  Flag,
  Pencil,
  Trash2,
} from 'lucide-react';

// ✅ 1. อัปเดต "คู่มือ" (Interface) ให้รับ Prop ที่จำเป็น
interface PostHeaderProps {
  isSolved: boolean;
  tags: string[];
  isCurrentUserAuthor: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const PostHeader = ({
  isSolved,
  tags,
  isCurrentUserAuthor,
  onEditClick,
  onDeleteClick,
}: PostHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleBookmark = () => setBookmarked(prev => !prev);

  // --- Close menu when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tagColorMap: Record<string, string> = {
    Math: 'bg-[#2563EB]',
    Physics: 'bg-[#FF9D00]',
    Chemistry: 'bg-[#9333EA]',
    Biology: 'bg-[#467322]',
    History: 'bg-[#893F07]',
    Geography: 'bg-[#1E6A91]',
    Economics: 'bg-[#FA733E]',
    Law: 'bg-[#000000]',
    Thai: 'bg-[#83110F]',
    English: 'bg-[#BE0EA7]',
    Chinese: 'bg-[#CBC400]',
    Programming: 'bg-[#6366F1]',
    Others: 'bg-[#63647A]',
  };

  // --- Helper: stop all propagation paths ---
  const stopAll = (e: React.MouseEvent) => {
    e.preventDefault();   // prevent Link default behavior
    e.stopPropagation();  // stop bubbling up
    e.nativeEvent.stopImmediatePropagation?.(); // stop React synthetic + native
  };

  return (
    <div
      className="flex justify-between items-center mb-4"
      onClick={stopAll} // ✅ ensure the whole header stops bubbling
    >
      {/* --- Left: tags and solved status --- */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <span
          className={`${
            isSolved ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
          } text-white font-bold px-2.5 py-1 rounded-md`}
        >
          {isSolved ? 'Solved' : 'Unsolved'}
        </span>

        {tags.map(tag => (
          <span
            key={tag}
            className={`${tagColorMap[tag] || 'bg-gray-500'} text-white font-bold px-2.5 py-1 rounded-md`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* --- Right: menu --- */}
      <div className="relative pointer-events-auto" ref={menuRef}>
        <button
          onClick={(e) => {
            stopAll(e); // ✅ fully stop bubbling
            setIsMenuOpen(prev => !prev);
          }}
          title="More options"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>

        {isMenuOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
            onClick={stopAll} // ✅ protect menu clicks
          >
            <div className="py-1">
              {/* Bookmark */}
              <button
                onClick={(e) => {
                  stopAll(e);
                  toggleBookmark();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Bookmark
                  className={`w-4 h-4 mr-3 ${
                    bookmarked ? 'text-accent-600' : ''
                  }`}
                />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>

              {/* Report */}
              <button
                onClick={(e) => {
                  stopAll(e);
                  alert('Report feature coming soon!');
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Flag className="w-4 h-4 mr-3" />
                Report
              </button>


              {isCurrentUserAuthor && ( 
              <>
              <div className="border-t border-gray-100 my-1" />

                {/* Edit */}
                <button
                  onClick={(e) => {
                    stopAll(e);
                    onEditClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 mr-3" />
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    stopAll(e);
                    onDeleteClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete
                </button>
              </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHeader;