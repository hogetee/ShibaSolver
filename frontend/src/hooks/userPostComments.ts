"use client";

import { useEffect, useState } from "react";

export type SortOption = "latest" | "popular" | "oldest" | "ratio";

export type PostComment = {
  comment_id: number;
  user_id: number;
  post_id: number;
  parent_comment: number | null;
  // Add user details here
  user_name: string;
  profile_picture: string | null;
  text: string;
  comment_image: string | null;
  is_solution: boolean;
  is_updated: boolean;
  created_at: string;
  likes: number;
  dislikes: number;
  total_votes: number;
  ratio: number | null;
};

type AccessControlledResponse = {
  success: boolean;
  restricted?: boolean;
  reason?: "LOGIN_REQUIRED" | "PREMIUM_REQUIRED" | null;
  post?: {
    post_id: number;
    created_at: string;
    is_recent_30d: boolean;
  } | null;
  count?: number;
  data?: PostComment[];
  message?: string;
};

type UsePostCommentsResult = {
  comments: PostComment[];
  isLoading: boolean;
  error: string | null;
  restricted: boolean;
  reason: "LOGIN_REQUIRED" | "PREMIUM_REQUIRED" | null;
  postMeta: AccessControlledResponse["post"];
  refetch: () => void;
};

export default function usePostComments(
  postId: number | string | null | undefined,
  sort: SortOption = "latest"
): UsePostCommentsResult {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restricted, setRestricted] = useState(false);
  const [reason, setReason] = useState<"LOGIN_REQUIRED" | "PREMIUM_REQUIRED" | null>(null);
  const [postMeta, setPostMeta] = useState<AccessControlledResponse["post"]>(null);
  const [nonce, setNonce] = useState(0);

  const refetch = () => setNonce((n) => n + 1);

  useEffect(() => {
    if (!postId) return;

    let aborted = false;
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);
        setRestricted(false);
        setReason(null);
        setPostMeta(null);

        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";
        if (USE_MOCK) {
          await new Promise((r) => setTimeout(r, 200));
          const mock: PostComment[] = [
            {
              comment_id: 1,
              user_id: 1,
              post_id: Number(postId),
              parent_comment: null,
              // Add mock user details
              user_name: "Mock User",
              profile_picture: null,
              text: "This is a mock comment from a mock user.",
              comment_image: null,
              is_solution: false,
              is_updated: false,
              created_at: new Date().toISOString(),
              likes: 10,
              dislikes: 1,
              total_votes: 11,
              ratio: 0.909
            }
          ];
          if (!aborted) setComments(mock);
          return;
        }

        const BASE_URL = process.env.BACKEND_URL || "http://localhost:5003";
        const url = new URL(`/api/v1/comments/post/${encodeURIComponent(String(postId))}`, BASE_URL);
        url.searchParams.set("sort", sort);


        // inside usePostComments, replace the fetch error handling
        const res = await fetch(url.toString(), { signal: controller.signal, credentials: "include" });
        let payload: any = null;
        try { payload = await res.json(); } catch {}
        if (!res.ok) {
        const msg = payload?.message || payload?.error || `Request failed (${res.status})`;
        throw new Error(msg);
        }
        // const res = await fetch(url.toString(), {
        //   signal: controller.signal,
        //   credentials: "include"
        // });

        // const payload: AccessControlledResponse = await res.json().catch(() => ({ success: false } as any));

        // if (!res.ok) {
        //   throw new Error(payload?.message || `Request failed (${res.status})`);
        // }

        if (payload.restricted) {
          if (!aborted) {
            setRestricted(true);
            setReason(payload.reason ?? null);
            setComments([]);
            setPostMeta(payload.post ?? null);
          }
          return;
        }

        const list = (payload.data ?? []).map((c: any) => ({
          comment_id: Number(c.comment_id),
          user_id: Number(c.user_id),
          post_id: Number(c.post_id),
          parent_comment: c.parent_comment == null ? null : Number(c.parent_comment),
          // Map the new user fields
          user_name: String(c.user_name ?? "Anonymous"),
          profile_picture: String(c.profile_picture ?? null),
          text: String(c.text ?? ""),
          comment_image:String( c.comment_image ?? null),
          is_solution: Boolean(c.is_solution),
          is_updated: Boolean(c.is_updated),
          created_at: String(c.created_at),
          likes: Number(c.likes ?? 0),
          dislikes: Number(c.dislikes ?? 0),
          total_votes: Number(c.total_votes ?? 0),
          ratio: c.ratio == null ? null : Number(c.ratio)
        })) as PostComment[];

        if (!aborted) {
          setComments(list);
          setPostMeta(payload.post ?? null);
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
  }, [postId, sort, nonce]);

  return { comments, isLoading, error, restricted, reason, postMeta, refetch };
}