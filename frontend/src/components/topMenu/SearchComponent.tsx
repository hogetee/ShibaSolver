import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useSearch } from "@/hooks/useSearch"
type Mode = "post" | "user";




type Props = {
  className?: string;
  onSelect?: (item: { type: Mode; value: any }) => void;
  initialMode?: Mode;
};

// MOCK
const ALL_TAGS = ["Math", "Phys", "Chem", "Bio", "Eng"];
// Color mapping for tags
const tagColors: { [key: string]: string } = {
  Math: "bg-indigo-600 text-white",
  Phys: "bg-yellow-400 text-yellow-900",
  Chem: "bg-green-500 text-white",
  Bio: "bg-cyan-500 text-white",
  Eng: "bg-red-500 text-white",
  Default: "bg-gray-500 text-white",
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


  const [selectedTags, setSelectedTags] = useState<string[]>(["Math", "Phys"]);
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
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
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
    return () => document.removeEventListener("mousedown", onClickAway);
  }, []);

  const { userResults, postResults, loading, error } = useSearch({
    mode,
    query,
    selectedTags: mode === "post" ? selectedTags : [],
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
        <div className="absolute -top-5 left-0 w-full z-10 rounded-3xl shadow-xl bg-white backdrop-blur border border-gray-200 overflow-hidden">          {/* Header row with input and icon, same visual as compact bar */}
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

          {/* Results list (User mode) */}
         {mode === "post" && (
            <div className="px-5 pb-3 flex items-center flex-wrap gap-2 border-b border-gray-200 relative">
              {/* --- Render Selected Tags --- */}
              {selectedTags.map((tag) => {
                const colors = tagColors[tag] || tagColors.Default;
                return (
                  <div
                    key={tag}
                    className={`pl-2.5 pr-1 py-1 text-sm font-medium rounded-lg flex items-center gap-1 ${colors}`}
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${tag} filter`}
                      onClick={() => removeTag(tag)}
                      className="w-4 h-4 rounded-full opacity-70 hover:opacity-100 hover:bg-black/20 grid place-items-center transition-all"
                    >
                      {/* Using style for precise icon sizing */}
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
              {(results as PostResult[]).map((p, idx) => (
                <button
                  key={p.id ?? idx}
                  className="w-full text-left px-5 py-4 hover:bg-pink-100 transition flex items-center gap-2"
                  onClick={() => onSelect?.({ type: "user", value: p })}
                >
                   
                  <div className="text-black font-semibold text-lg">{p.title}</div>
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="w-12 h-12 rounded object-cover ml-4"
                    />
                  ) : null}
                </button>
              ))}
            </div>
          )}

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
                  {query ? "No posts found" : "Start typing to search posts"}
                </div>
              )}

              {(results as UserResult[]).map((u, idx) => (
                <button
                  key={u.id ?? idx}
                  className="w-full text-left px-5 py-4 hover:bg-pink-100 transition flex items-center gap-2"
                  onClick={() => onSelect?.({ type: "user", value: u })}
                >
                   {u.avatarUrl ? (
                    <img
                      src={u.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded object-cover ml-4"
                    />
                  ) : null}
                  <div className="text-black font-semibold text-lg">{u.username}</div>
                 
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}