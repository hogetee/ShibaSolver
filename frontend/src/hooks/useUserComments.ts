"use client";

import { useEffect, useState } from "react";

export type CommentData = {
  comment_id: string;
  post_id: string;
  user_id: string;
  is_solution: boolean;
  text: string;
  solution_image?: string;
  is_deleted?: boolean;
  comment_parent_id?: string | null;
  created_at?: string;
};

type UseUserCommentsResult = {
  comments: CommentData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export default function useUserComments(username?: string | null): UseUserCommentsResult {
  const [comments, setComments] = useState<CommentData[]>([]);
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
          const mock: CommentData[] = [
            {
              comment_id: "c-1",
              post_id: "post-001",
              user_id: username || "user-1",
              is_solution: false,
              text: "Following this thread!",
              created_at: new Date().toISOString(),
            },
          ];
          if (!aborted) setComments(mock);
        } else {
          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const res = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(username!)}/comments`, {
            signal: controller.signal,
            credentials: "include",
          });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Request failed (${res.status})`);
          }
          const payload = await res.json();
          const list: CommentData[] = (payload?.data ?? []).map((c: any) => ({
            comment_id: String(c.comment_id),
            post_id: String(c.post_id),
            user_id: String(c.user_id),
            is_solution: Boolean(c.is_solution),
            text: c.text,
            solution_image: c.solution_image || undefined,
            is_deleted: Boolean(c.is_deleted),
            comment_parent_id: c.comment_parent_id ?? null,
            created_at: c.create_at || c.created_at || undefined,
          }));
          if (!aborted) setComments(list);
        }
      } catch (err: any) {
        if (aborted) return;
        setError(err?.message || "Failed to load comments");
        setComments([]);
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

  return { comments, isLoading: loading, error, refetch };
}


