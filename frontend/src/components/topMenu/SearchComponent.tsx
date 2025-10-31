import React, { useEffect, useMemo, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

type Mode = "post" | "user";



type UserResult = {
  id: string | number;
  username: string;
  avatarUrl?: string;
};

type PostResult = {
    id: string | number;
    title: string;
    imageUrl?:string;
};
  

type Props = {
  className?: string;
  onSelect?: (item: { type: Mode; value: any }) => void;
  initialMode?: Mode;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [postResults, setPostResults] = useState<PostResult[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  // Debounced fetch (User mode)
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const controller = new AbortController();

    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      const USE_MOCK = "true"; // toggle to "false" to call API
      try {
        if (mode === "user") {
          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 200));
            const mockNames = ["Nano", "Tee", "Aea", "Mika", "Pond", "Jane", "Ikkyu"];
            const list: UserResult[] = mockNames
              .filter((n) => (q ? n.toLowerCase().includes(q.toLowerCase()) : true))
              .map((n, i) => ({
                id: `user-${i + 1}`,
                username: n,
                avatarUrl: "/image/DefaultAvatar.png",
              }));
            setUserResults(list);
          } else {
            const params = new URLSearchParams();
            if (q) params.set("search", q);
            const res = await fetch(`${BASE_URL}/api/v1/users?${params}`, {
              signal: controller.signal,
              credentials: "include",
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body?.message || "Request failed");
            const list: UserResult[] = (body?.data ?? []).map((u: any) => ({
              id: u.user_id ?? u.id,
              username: u.user_name ?? u.username ?? "user",
              avatarUrl: u.profile_picture ?? "/image/DefaultAvatar.png",
            }));
            setUserResults(list);
          }
        } else {
          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 200));
            const titles = [
              "How to solve these quadratic equations",
              "Need help with derivatives",
              "Understanding vectors in 3D",
              "Best way to balance chemical equations",
              "Any tips for dynamic programming?"
            ];
            const list: PostResult[] = titles
              .filter((t) => (q ? t.toLowerCase().includes(q.toLowerCase()) : true))
              .map((t, i) => ({
                id: `post-${i + 1}`,
                title: t,
                imageUrl: undefined,
              }));
            setPostResults(list);
          } else {
            const params = new URLSearchParams();
            if (q) params.set("search", q);
            const res = await fetch(`${BASE_URL}/api/v1/posts?${params}`, {
              signal: controller.signal,
              credentials: "include",
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body?.message || "Request failed");
            const list: PostResult[] = (body?.data ?? []).map((p: any) => ({
              id: p.post_id ?? p.id,
              title: p.title ?? "Untitled",
              imageUrl: p.problem_image ?? p.imageUrl ?? undefined,
            }));
            setPostResults(list);
          }
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        setError(err?.message || "Failed to search");
        if (mode === "user") setUserResults([]);
        else setPostResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [open, mode, query]);

  const results = useMemo(
    () => (mode === "user" ? userResults : postResults),
    [mode, userResults, postResults]
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
        <div className="absolute -top-5 left-0 w-full z-10 rounded-3xl shadow-xl bg-white/95 backdrop-blur border border-gray-200 overflow-hidden">          {/* Header row with input and icon, same visual as compact bar */}
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
              {(results as UserResult[]).map((u, idx) => (
                <button
                  key={u.id ?? idx}
                  className="w-full text-left px-5 py-4 hover:bg-purple-100/60 focus:bg-purple-100/60 transition flex items-center gap-4"
                  onClick={() => onSelect?.({ type: "user", value: u })}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-300 overflow-hidden">
                    <img
                      src={u.avatarUrl || "/image/DefaultAvatar.png"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xl font-semibold text-purple-700">
                    {u.username}
                  </div>
                </button>
              ))}
            </div>
          )}

          {mode === "post" && (
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

              {(results as PostResult[]).map((p, idx) => (
                <button
                  key={p.id ?? idx}
                  className="w-full text-left px-5 py-4 hover:bg-purple-50 transition flex items-center justify-between"
                  onClick={() => onSelect?.({ type: "post", value: p })}
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
        </div>
      )}
    </div>
  );
}