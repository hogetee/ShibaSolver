import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSearch, PostResult, UserResult } from "@/hooks/useSearch";
import { slugify } from "@/utils/slugify";
type Mode = "post" | "user";




type Props = {
  className?: string;
  onSelect?: (item: { type: Mode; value: any }) => void;
  initialMode?: Mode;
};

const ALL_TAGS = ["Math", "Physics", "Chemistry", "Biology", "History", "Geography",
  "Economics", "Law", "Thai", "English", "Chinese", "Programming", "Others"];
// Color mapping for tags
const tagColors: { [key: string]: string } = {
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

export default function SearchComponent({
  className,
  onSelect,
  initialMode = "user",
}: Props) {
  // Closed by default to show the compact pill
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [query, setQuery] = useState("");


  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverButtonRef = useRef<HTMLButtonElement | null>(null);


  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Close on outside click
  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setTagPopoverOpen(false);
        setOpen(false);
        setSelectedTags([]);
        setQuery("");
      }
    }

    function onEscKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Esc") {
        setTagPopoverOpen(false);
        setOpen(false);
        setSelectedTags([]);
        setQuery("");
      }
    }

    document.addEventListener("keydown", onEscKey);
    document.addEventListener("mousedown", onClickAway);

    return () => {
      document.removeEventListener("keydown", onEscKey);
      document.removeEventListener("mousedown", onClickAway);
    };
  }, []);

  useEffect(() => {
    function onClickAway(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        popoverButtonRef.current &&
        !popoverButtonRef.current.contains(e.target as Node)
      ) {
        setTagPopoverOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickAway);

    return () => {
      document.removeEventListener("mousedown", onClickAway);
    };
  }, []);

  const { userResults, postResults, loading, error } = useSearch({
    mode,
    query,
    selectedTags,
    enabled: open, // Only search when dropdown is open
  });

  const results = useMemo(
    () => (mode === "user" ? userResults : postResults),
    [mode, userResults, postResults]
  );

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };
  const addTag = (tag: string) => {
    setSelectedTags((prev) => [...prev, tag]);
    setTagPopoverOpen(false); // Close popover after adding
  };
  const availableTagsForPopover = ALL_TAGS.filter(
    (t) => !selectedTags.includes(t)
  );

  // Helper function to handle link click
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: Mode, value: PostResult | UserResult, href: string) => {
    e.preventDefault();
    onSelect?.({ type, value });
    // Close dropdown after navigation
    setOpen(false);
    setQuery("");
    window.location.href = href;
  };

  return (
    <div ref={containerRef} className={`${className} relative`}>
      {/* Compact pill (closed state) */}
      {!open && (
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search"
            className="w-full rounded-full pl-5 pr-12 py-2 bg-white text-black border border-gray-300 placeholder-gray-400 focus:outline-none"
          />
          <button
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(true)}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-gray-800 hover:bg-purple-200  hover:text-purple-800 grid place-items-center"
            >
                <SearchIcon fontSize="small" />
            </button>
        </div>
      )}

      {/* Dropdown (open state) */}
      {open && (
        <div className="absolute left-0 w-full z-10 rounded-3xl shadow-xl bg-white backdrop-blur border border-gray-200 ">          {/* Header row with input and icon, same visual as compact bar */}
          <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="Search"
                className="w-full rounded-full pl-5 pr-12 py-2 bg-white text-black placeholder-gray-400 focus:outline-none"
            />
            <button
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(true)}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-gray-800 hover:bg-purple-200  hover:text-purple-800 grid place-items-center"
            >
                <SearchIcon fontSize="small" />
            </button>
        </div>

          {/* Mode selector */}
          <div className="px-5 pt-3 pb-2 flex items-center gap-10">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400">
              <input
                type="radio"
                name="search-mode"
                checked={mode === "post"}
                onChange={() => setMode("post")}
                className="accent-purple-600"
              />
              <span className={mode === "post" ? "text-purple-700" : ""}>Post</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-400">
              <input
                type="radio"
                name="search-mode"
                checked={mode === "user"}
                onChange={() => setMode("user")}
                className="accent-purple-600"
              />
              <span className={mode === "user" ? "text-purple-700" : ""}>User</span>
            </label>
          </div>

          {/* Post mode: Tags and Results */}
          {mode === "post" && (
            <>
              {/* Tag selector */}
              <div className="px-5 pb-3 flex items-center flex-wrap gap-2 border-b border-gray-200 relative">
                {/* --- Render Selected Tags --- */}
                {selectedTags.map((tag) => {
                  const colors = tagColors[tag] || tagColors.Default;
                  return (
                    <div
                      key={tag}
                      className={`pl-2.5 pr-1 py-1 text-sm text-white font-medium rounded-lg flex items-center gap-1 ${colors}`}
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${tag} filter`}
                        onClick={() => removeTag(tag)}
                        className="w-4 h-4 rounded-full opacity-70 hover:opacity-100 hover:bg-black/20 grid place-items-center transition-all"
                      >
                        <CloseIcon style={{ fontSize: "0.8rem" }} />
                      </button>
                    </div>
                  );
                })}

                {/* --- Add Tag Button and Popover --- */}
                {availableTagsForPopover.length > 0 && (
                  <div className="relative">
                    <button
                      ref={popoverButtonRef}
                      type="button"
                      aria-label="Add tag filter"
                      onClick={() => setTagPopoverOpen((prev) => !prev)}
                      className={`w-6 h-6 rounded-full grid place-items-center border-2 ${
                        tagPopoverOpen
                          ? "border-purple-600 text-purple-600"
                          : "border-gray-400 text-gray-400"
                      } hover:border-purple-600 hover:text-purple-600 transition`}
                    >
                      <AddIcon style={{ fontSize: "1rem" }} />
                    </button>

                    {/* --- Popover Dropdown --- */}
                    {tagPopoverOpen && (
                      <div
                        ref={popoverRef}
                        className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20"
                      >
                        {availableTagsForPopover.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="w-full text-left px-3 py-2 text-gray-800 hover:bg-purple-100 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post results list */}
              <div className="max-h-72 overflow-y-auto pr-1">
                {loading && (
                  <div className="px-5 py-4 text-gray-500 text-sm">Searching…</div>
                )}
                {error && !loading && (
                  <div className="px-5 py-4 text-red-600 text-sm">{error}</div>
                )}
                {!loading && !error && results.length === 0 && (
                  <div className="px-5 py-4 text-gray-500 text-sm">
                    {query ? "No posts found" : "Start typing to search posts"}
                  </div>
                )}

                {(results as PostResult[]).map((p, idx) => {
                  const slug = slugify(p.title);
                  const href = `/post/${p.id}/${slug}`;
                  
                  return (
                    <Link
                      key={p.id ?? idx}
                      href={href}
                      className="w-full text-left px-5 py-4 hover:bg-pink-100 transition flex items-center gap-2"
                      onClick={(e) => handleLinkClick(e, "post", p, href)}
                    >
                      <div className="text-black font-semibold text-lg">{p.title}</div>
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded object-cover ml-4"
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* User mode: Results */}
          {mode === "user" && (
            <div className="max-h-72 overflow-y-auto pr-1">
              {loading && (
                <div className="px-5 py-4 text-gray-500 text-sm">Searching…</div>
              )}
              {error && !loading && (
                <div className="px-5 py-4 text-red-600 text-sm">{error}</div>
              )}
              {!loading && !error && results.length === 0 && (
                <div className="px-5 py-4 text-gray-500 text-sm">
                  {query ? "No users found" : "Start typing to search users"}
                </div>
              )}

              {(results as UserResult[]).map((u, idx) => {
                const href = `/user/${u.username}`;
                return (
                  <Link
                    key={u.id ?? idx}
                    href={href}
                    className="w-full text-left px-5 py-4 hover:bg-pink-100 transition flex items-center gap-2 "
                    onClick={(e) => handleLinkClick(e, "user", u, href)}
                  >
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded object-cover ml-4"
                      />
                    ) : null}
                    <div className="text-black font-semibold text-lg">{u.username}</div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
      )}
    </div>
  );
}