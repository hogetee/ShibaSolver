"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Bookmark, Flag, Pencil, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:5003/api/v1";

interface PostHeaderProps {
  isSolved: boolean;
  tags: string[];
  isCurrentUserAuthor: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onReportClick: () => void; 
  postId?: string;
}

export default function PostHeader({
  isSolved,
  tags,
  isCurrentUserAuthor,
  onEditClick,
  onDeleteClick,
  onReportClick,
  postId,
}: PostHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const stopAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation?.();
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Fetch bookmark status correctly using GET /posts/bookmarks
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!postId) return;

      try {
        const res = await fetch(`${API_BASE}/posts/bookmarks`, {
          credentials: "include",
        });

        const json = await res.json();
        if (!json.success) return;

        const list = json.data; // array of bookmarked posts

        const isBookmarked = list.some((item: any) => item.post_id == postId);

        setBookmarked(isBookmarked);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarkStatus();
  }, [postId]);

  // ✅ Add / Remove bookmark using correct backend routes
  const handleToggleBookmark = async (e: React.MouseEvent) => {
    stopAll(e);
    if (!postId || loadingBookmark) return;

    const nextState = !bookmarked;
    setBookmarked(nextState);
    setLoadingBookmark(true);

    try {
      const method = nextState ? "POST" : "DELETE";

      const res = await fetch(`${API_BASE}/posts/bookmarks/${postId}`, {
        method,
        credentials: "include",
      });

      if (!res.ok) {
        setBookmarked(!nextState);
        console.error(await res.text());
        alert("Failed to update bookmark.");
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      setBookmarked(!nextState);
    } finally {
      setLoadingBookmark(false);
      setIsMenuOpen(false);
    }
  };

  const tagColorMap: Record<string, string> = {
    Math: "bg-[#2563EB]",
    Physics: "bg-[#FF9D00]",
    Chemistry: "bg-[#9333EA]",
    Biology: "bg-[#467322]",
    History: "bg-[#893F07]",
    Geography: "bg-[#1E6A91]",
    Economics: "bg-[#FA733E]",
    Law: "bg-[#000000]",
    Thai: "bg-[#83110F]",
    English: "bg-[#BE0EA7]",
    Chinese: "bg-[#CBC400]",
    Programming: "bg-[#6366F1]",
    Others: "bg-[#63647A]",
  };

  return (
    <div className="flex justify-between items-center mb-4" onClick={stopAll}>
      <div className="flex items-center gap-2 pointer-events-auto">
        <span
          className={`${
            isSolved ? "bg-[#16A34A]" : "bg-[#DC2626]"
          } text-white font-bold px-2.5 py-1 rounded-md`}
        >
          {isSolved ? "Solved" : "Unsolved"}
        </span>

        {tags.map((tag) => (
          <span
            key={tag}
            className={`${tagColorMap[tag] || "bg-gray-500"} text-white font-bold px-2.5 py-1 rounded-md`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative pointer-events-auto" ref={menuRef}>
        <button
          onClick={(e) => {
            stopAll(e);
            setIsMenuOpen((prev) => !prev);
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
            <div className="py-1">

              {/* ✅ Bookmark */}
              <button
                onClick={handleToggleBookmark}
                disabled={loadingBookmark}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  loadingBookmark ? "opacity-50 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 mr-3 ${
                    bookmarked ? "text-yellow-500 fill-yellow-500" : ""
                  }`}
                />
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>

              {/* ✅ แก้ไข Report Button */}
              <button
                onClick={(e) => { 
                  stopAll(e); 
                  onReportClick(); // เรียกใช้ Prop ใหม่
                  setIsMenuOpen(false); 
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Flag className="w-4 h-4 mr-3" />
                Report
              </button>

              {/* ✅ Author actions */}
              {isCurrentUserAuthor && (
                <>
                  <div className="border-t my-1" />

                  <button
                    onClick={(e) => {
                      stopAll(e);
                      onEditClick();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <Pencil className="w-4 h-4 mr-3" />
                    Edit
                  </button>

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
}