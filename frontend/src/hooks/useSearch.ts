"use client";

import { useEffect, useState, useRef } from "react";

type Mode = "post" | "user";

export type UserResult = {
  id: string | number;
  username: string;
  avatarUrl?: string;
};

export type PostResult = {
  id: string | number;
  title: string;
  imageUrl?: string;
  description?: string;
  created_at?: string;
  is_solved?: boolean;
  author?: {
    user_id: string | number;
    user_name?: string;
    display_name?: string;
    profile_picture?: string;
  };
  tags?: string[];
};

type UseSearchOptions = {
  mode: Mode;
  query: string;
  selectedTags?: string[]; // For post search filtering
  enabled?: boolean; // To control when search runs
  debounceMs?: number; // Default 500ms
  minQueryLength?: number; // Minimum characters before searching (default 2)
};

type UseSearchResult = {
  userResults: UserResult[];
  postResults: PostResult[];
  loading: boolean;
  error: string | null;
};

// Move BASE_URL outside the component or use a constant
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export function useSearch({
  mode,
  query,
  selectedTags = [],
  enabled = true,
  debounceMs = 20,
  minQueryLength = 1,
}: UseSearchOptions): UseSearchResult {
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  const [postResults, setPostResults] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to track previous values and avoid unnecessary state updates
  const prevQueryRef = useRef<string>("");
  const prevModeRef = useRef<Mode>(mode);

  useEffect(() => {
    if (!enabled) {
      // Clear results when disabled
      setUserResults([]);
      setPostResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const q = query.trim();
    const controller = new AbortController();

    // Early return: if query is too short, clear results and don't fetch
    if (q.length < minQueryLength) {
      // Use functional updates to avoid dependency on current state
      setUserResults((prev) => (prev.length > 0 ? [] : prev));
      setPostResults((prev) => (prev.length > 0 ? [] : prev));
      setLoading(false);
      setError(null);
      return;
    }

    // Skip if query and mode haven't changed
    if (q === prevQueryRef.current && mode === prevModeRef.current) {
      return;
    }

    prevQueryRef.current = q;
    prevModeRef.current = mode;

    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);

      const USE_MOCK = false;

      try {
        if (mode === "user") {
          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 200));
            const mockNames = ["Nano", "Tee", "Aea", "Mika", "Pond", "Jane", "Ikkyu"];
            const list: UserResult[] = mockNames
              .filter((n) => n.toLowerCase().includes(q.toLowerCase()))
              .map((n, i) => ({
                id: `user-${i + 1}`,
                username: n,
                avatarUrl: "/image/DefaultAvatar.png",
              }));
            setUserResults(list);
          } else {
            const url = new URL("/api/v1/search/users", BASE_URL);
            url.searchParams.set("query", q);
            const res = await fetch(url.toString(), {
              method: "GET",
              signal: controller.signal,
              credentials: "include",
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body?.message || "Request failed");
            const items = body.users ?? [];
            const list: UserResult[] = items.map((u: any) => ({
              id: u.user_id,
              username: u.user_name ?? u.display_name,
              avatarUrl: u.profile_picture ?? "/image/DefaultAvatar.png",
            }));
            setUserResults(list);
          }
        } else {
          // POST SEARCH MODE - Using the new searchPosts API
          if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 200));
            const titles = [
              "How to solve these quadratic equations",
              "Need help with derivatives",
              "Understanding vectors in 3D",
              "Best way to balance chemical equations",
              "Any tips for dynamic programming?",
            ];
            const list: PostResult[] = titles
              .filter((t) => t.toLowerCase().includes(q.toLowerCase()))
              .map((t, i) => ({
                id: `post-${i + 1}`,
                title: t,
                imageUrl: undefined,
              }));
            setPostResults(list);
          } else {
            const url = new URL("/api/v1/search/posts", BASE_URL);
            url.searchParams.set("query", q);
            const res = await fetch(url.toString(), {
              method: "GET",
              signal: controller.signal,
              credentials: "include",
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body?.message || "Request failed");

            // Map the API response to PostResult format
            const posts: PostResult[] = (body?.posts ?? []).map((p: any) => ({
              id: p.post_id ?? p.id,
              title: p.title ?? "Untitled",
              description: p.description,
              imageUrl: p.post_image ?? p.problem_image ?? undefined,
              created_at: p.created_at,
              is_solved: p.is_solved,
              author: p.author
                ? {
                    user_id: p.author.user_id,
                    user_name: p.author.user_name,
                    display_name: p.author.display_name,
                    profile_picture: p.author.profile_picture,
                  }
                : undefined,
              tags: Array.isArray(p.tags) ? p.tags : [],
            }));

            // Client-side tag filtering if selectedTags is provided
            let filteredPosts = posts;
            if (selectedTags.length > 0) {
              filteredPosts = posts.filter((post) =>
                selectedTags.some((tag) => post.tags?.includes(tag))
              );
            }

            setPostResults(filteredPosts);
          }
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        setError(err?.message || "Failed to search");
        if (mode === "user") {
          setUserResults([]);
        } else {
          setPostResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [mode, query, selectedTags, enabled, debounceMs, minQueryLength]);

  return {
    userResults,
    postResults,
    loading,
    error,
  };
}