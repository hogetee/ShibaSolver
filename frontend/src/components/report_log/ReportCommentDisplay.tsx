"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { Avatar, Chip } from "@mui/material";
import { userService } from "@/utils/userService";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

const DEFAULT_AVATAR = "/image/DefaultAvatar.png";

export interface ReportCommentDisplayData {
  id: string;
  text: string;
  created_at: string;
  is_solution: boolean;
  post_id?: string | null;
  post_title?: string | null;
  author: {
    user_id: string;
    display_name: string;
    username?: string;
    profile_picture?: string | null;
  };
  stats: {
    likes: number;
    dislikes: number;
  };
}

type ReportCommentDisplayProps = {
  commentId?: string | null;
  fallbackData?: Partial<ReportCommentDisplayData> | null;
};

function normalizeCommentData({
  source,
  fallback,
  commentId,
}: {
  source?: any;
  fallback?: Partial<ReportCommentDisplayData> | null;
  commentId?: string | null;
}): ReportCommentDisplayData | null {
  const fallbackData = fallback ?? undefined;
  const raw = source ?? undefined;

  const resolvedId =
    raw?.comment_id ?? raw?.id ?? fallbackData?.id ?? commentId ?? null;

  if (!resolvedId) {
    return null;
  }

  const authorRaw = raw?.author ?? raw?.user ?? raw?.commenter ?? undefined;
  const fallbackAuthor = fallbackData?.author;

  return {
    id: String(resolvedId),
    text: String(raw?.text ?? fallbackData?.text ?? ""),
    created_at:
      raw?.created_at ??
      raw?.updated_at ??
      fallbackData?.created_at ??
      new Date().toISOString(),
    is_solution: Boolean(
      raw?.is_solution ?? raw?.solution ?? fallbackData?.is_solution ?? false
    ),
    post_id:
      String(raw?.post_id ?? raw?.postId ?? fallbackData?.post_id ?? "") ||
      null,
    post_title:
      raw?.post_title ?? raw?.post?.title ?? fallbackData?.post_title ?? null,
    author: {
      user_id:
        String(
          authorRaw?.user_id ??
            authorRaw?.id ??
            raw?.user_id ??
            fallbackAuthor?.user_id ??
            ""
        ) || "",
      display_name:
        authorRaw?.display_name ??
        authorRaw?.username ??
        raw?.author_name ??
        raw?.comment_owner_name ??
        fallbackAuthor?.display_name ??
        "Unknown commenter",
      username:
        authorRaw?.username ??
        raw?.comment_owner_username ??
        fallbackAuthor?.username,
      profile_picture:
        authorRaw?.profile_picture ??
        fallbackAuthor?.profile_picture ??
        DEFAULT_AVATAR,
    },
    stats: {
      likes: Number(
        raw?.likes ?? raw?.stats?.likes ?? fallbackData?.stats?.likes ?? 0
      ),
      dislikes: Number(
        raw?.dislikes ??
          raw?.stats?.dislikes ??
          fallbackData?.stats?.dislikes ??
          0
      ),
    },
  };
}

export default function ReportCommentDisplay({
  commentId,
  fallbackData = null,
}: ReportCommentDisplayProps) {
  const initialData = useMemo(
    () => normalizeCommentData({ fallback: fallbackData, commentId }),
    [fallbackData, commentId]
  );

  const [commentData, setCommentData] =
    useState<ReportCommentDisplayData | null>(initialData);
  const [postTitle, setPostTitle] = useState<string | null>(
    initialData?.post_title ?? null
  );
  const [loading, setLoading] = useState<boolean>(
    Boolean(commentId) && !initialData
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!commentId) return;
    
    // If we have fallback data with text content, we don't need to fetch
    // This prevents unnecessary API calls when viewing admin reports
    if (fallbackData?.text) {
      return;
    }

    let cancelled = false;

    async function fetchComment() {
      setLoading(!initialData); // Only show loading if we don't have fallback data
      setError(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/comments/${commentId}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const json = await response.json().catch(() => null);

        if (!response.ok) {
          if (!cancelled) {
            // Ensure error is always a string
            let statusMessage = `Failed to fetch comment (${response.status})`;
            
            if (json?.message) {
              statusMessage = typeof json.message === 'string' 
                ? json.message 
                : JSON.stringify(json.message);
            } else if (json?.error) {
              statusMessage = typeof json.error === 'string' 
                ? json.error 
                : JSON.stringify(json.error);
            }
            
            setError(statusMessage);
          }
          return;
        }

        const rawData = Array.isArray(json?.data)
          ? json.data[0]
          : json?.data ?? json;

        const normalized = normalizeCommentData({
          source: rawData,
          fallback: fallbackData ?? undefined,
          commentId,
        });

        if (!cancelled) {
          setCommentData(normalized);
          if (normalized?.post_title) {
            setPostTitle(normalized.post_title);
          }
          setError(null); // Clear error on success
        }

        console.log(normalized);

        // Fetch user profile picture if username is available
        if (normalized?.author.username && !cancelled) {
          try {
            const userProfilePic = await userService.getUserProfileByUsername(
              normalized.author.username
            );
            if (userProfilePic && !cancelled) {
              // Handle the case where userProfilePic might be an object or string
              let profilePicUrl = DEFAULT_AVATAR;
              
              if (typeof userProfilePic === 'string') {
                profilePicUrl = userProfilePic;
              } else if (typeof userProfilePic === 'number') {
                // If it's a number, it's likely an error case, use default
                profilePicUrl = DEFAULT_AVATAR;
              } else if (userProfilePic && typeof userProfilePic === 'object') {
                // If it's an object, try to extract the URL
                profilePicUrl = (userProfilePic as any)?.profile_picture || 
                                (userProfilePic as any)?.url || 
                                DEFAULT_AVATAR;
              }
              
              setCommentData((prevData) => {
                if (!prevData) return prevData;
                return {
                  ...prevData,
                  author: {
                    ...prevData.author,
                    profile_picture: profilePicUrl,
                  },
                };
              });
            }
          } catch (err) {
            console.warn("Failed to fetch user profile picture", err);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          console.error("ReportCommentDisplay: error fetching comment", err);
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchComment();

    return () => {
      cancelled = true;
    };
  }, [commentId, fallbackData]);

  useEffect(() => {
    const postId = commentData?.post_id;
    if (!postId || postTitle) return;

    let cancelled = false;

    async function fetchPostTitle() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/posts/${postId}`, {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) return;

        const json = await response.json();
        const post = Array.isArray(json?.data)
          ? json.data[0]
          : json?.data ?? json;
        const title = post?.title ? String(post.title) : null;
        if (!cancelled) {
          setPostTitle(title);
        }
      } catch (err) {
        console.warn("ReportCommentDisplay: failed to fetch post title", err);
      }
    }

    fetchPostTitle();

    return () => {
      cancelled = true;
    };
  }, [commentData?.post_id, postTitle]);

  if (!commentId && !commentData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-gray-500">
          Comment data not available for this report.
        </p>
      </div>
    );
  }

  if (loading && !commentData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-gray-500">
          Loading comment preview...
        </p>
      </div>
    );
  }

  if (error && !commentData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-red-500">
          Failed to load comment preview: {error}
        </p>
      </div>
    );
  }

  if (!commentData) {
    return null;
  }

  const postHref = commentData.post_id
    ? `/post/${commentData.post_id}/${slugify(postTitle || "reported-comment")}`
    : null;

  return (
    <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Avatar
            alt={commentData.author.display_name}
            src={commentData.author.profile_picture || DEFAULT_AVATAR}
            className="h-10 w-10"
          />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-dark-900">
                {commentData.author.display_name}
              </span>
              {commentData.is_solution && (
                <Chip
                  size="small"
                  color="success"
                  label="Solution"
                  className="!text-xs"
                />
              )}
            </div>
            {commentData.author.username && (
              <span className="text-xs text-gray-500">
                @{commentData.author.username}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {new Date(commentData.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-800">
          {commentData.text || "No content provided."}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
          {postHref && (
            <Link
              href={postHref}
              className="ml-auto text-accent-600 transition-colors hover:text-accent-500"
              aria-label="View full comment in post"
            >
              View in post →
            </Link>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm text-amber-800 font-medium">
              Unable to load full comment details
            </p>
            <p className="text-xs text-amber-600 mt-1">{error}</p>
            {commentData.text === "" && (
              <p className="text-xs text-amber-600 mt-1">
                The comment may have been deleted. Showing saved report data.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
