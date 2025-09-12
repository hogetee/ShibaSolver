"use client";

import { useEffect, useState } from "react";
import type { PostData } from "@/components/post/Post"; // type-only import

type UseUserPostsResult = {
  posts: PostData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export default function useUserPosts(username?: string | null): UseUserPostsResult {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const refetch = () => setNonce((n) => n + 1);

  useEffect(() => {
    if (!username) return;
    let aborted = false;
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 200));
          const mock: PostData[] = [
            {
              post_id: "post-001",
              title: "How to solve these chemical equations",
              description: "I need help with these chemical equations. I'm stuck on balancing the atoms.",
              is_solved: true,
              created_at: new Date().toISOString(),
              tags: ["Science"],
              author: {
                user_id: username || "user-1",
                display_name: username || "User",
                profile_picture: "/image/DefaultAvatar.png",
              },
              stats: { likes: 12, dislikes: 4 },
              topComment: {
                comment_id: "comment-101",
                text: "This is very helpful! Remember to balance the hydrogens last.",
                created_at: new Date().toISOString(),
                likes: 15,
                author: {
                  user_id: "user-tee",
                  display_name: "Tee",
                  profile_picture: "/image/DefaultAvatar.png",
                },
              },
            },
          ];
          if (!aborted) setPosts(mock);
        } else {
          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const res = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(username!)}/posts`, {
            signal: controller.signal,
            credentials: "include",
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Request failed (${res.status})`);
          }
          const payload = await res.json();
          // Map backend fields -> UI PostData
          const list: PostData[] = (payload?.data ?? []).map((p: any) => ({
            post_id: String(p.post_id),
            title: p.title,
            description: p.description,
            is_solved: Boolean(p.is_solved),
            created_at: p.create_at || p.created_at || new Date().toISOString(),
            tags: Array.isArray(p.tag) ? p.tag : (p.tag ? [p.tag] : []),
            post_image: p.problem_image || undefined,
            author: {
              user_id: String(p.user_id),
              display_name: username || String(p.user_id),
              profile_picture: "/image/DefaultAvatar.png",
            },
            stats: { likes: 0, dislikes: 0 },
          }));
          if (!aborted) setPosts(list);
        }
      } catch (err: any) {
        if (aborted) return;
        setError(err?.message || "Failed to load posts");
        setPosts([]);
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    run();
    return () => {
      aborted = true;
      controller.abort();
    };
  }, [username, nonce]);

  return { posts, isLoading: loading, error, refetch };
}


