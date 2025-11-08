"use client";

import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/utils/slugify";
import PostHeader from "../post/PostHeader";
import PostContent from "../post/PostContent";
import Link from "next/link";
import { Avatar } from "@mui/material";

export interface ReportPostDisplayData {
  id: string;
  title: string;
  description: string;
  post_image?: string;
  is_solved: boolean;
  created_at: string;
  tags: string[];
  author: {
    user_id: string;
    display_name: string;
    username?: string;
    profile_picture?: string;
  };
  stats: {
    likes: number;
    dislikes: number;
  };
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

const DEFAULT_AVATAR = "/image/DefaultAvatar.png";

type ReportPostDisplayProps = {
  postId?: string | null;
  fallbackData?: Partial<ReportPostDisplayData> | null;
};

function normalizePostData({
  source,
  fallback,
  postId,
}: {
  source?: any;
  fallback?: Partial<ReportPostDisplayData> | null;
  postId?: string | null;
}): ReportPostDisplayData | null {
  const fallbackData = fallback ?? undefined;
  const raw = source ?? undefined;

  const hasAnyData = raw || fallbackData;
  if (!hasAnyData && !postId) {
    return null;
  }

  const tagsRaw = raw?.tags ?? raw?.tag ?? fallbackData?.tags ?? [];
  const normalizedTags = Array.isArray(tagsRaw)
    ? tagsRaw.filter(Boolean).map((tag: any) => String(tag))
    : typeof tagsRaw === "string" && tagsRaw.length > 0
      ? tagsRaw.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  const authorRaw = raw?.author ?? raw?.user ?? undefined;
  const fallbackAuthor = fallbackData?.author;

  const resolvedId =
    raw?.post_id ??
    raw?.id ??
    fallbackData?.id ??
    postId ??
    null;

  if (!resolvedId) {
    return null;
  }

  return {
    id: String(resolvedId),
    title: raw?.title ?? fallbackData?.title ?? "Untitled post",
    description:
      raw?.description ??
      raw?.content ??
      fallbackData?.description ??
      "",
    post_image:
      raw?.post_image ??
      raw?.problem_image ??
      fallbackData?.post_image,
    is_solved:
      typeof raw?.is_solved === "boolean"
        ? raw.is_solved
        : typeof fallbackData?.is_solved === "boolean"
          ? fallbackData.is_solved
          : false,
    created_at:
      raw?.created_at ??
      fallbackData?.created_at ??
      new Date().toISOString(),
    tags: normalizedTags.length ? normalizedTags : fallbackData?.tags ?? [],
    author: {
      user_id:
        String(
          authorRaw?.user_id ??
          raw?.user_id ??
          fallbackAuthor?.user_id ??
          ""
        ) || "",
      display_name:
        authorRaw?.display_name ??
        authorRaw?.username ??
        raw?.author_name ??
        raw?.post_owner_name ??
        fallbackAuthor?.display_name ??
        "Unknown author",
      username:
        authorRaw?.username ??
        raw?.post_owner_username ??
        fallbackAuthor?.username,
      profile_picture:
        authorRaw?.profile_picture ??
        fallbackAuthor?.profile_picture ??
        DEFAULT_AVATAR,
    },
    stats: {
      likes: Number(
        raw?.likes ??
        raw?.stats?.likes ??
        fallbackData?.stats?.likes ??
        0
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

export default function ReportPostDisplay({
  postId,
  fallbackData = null,
}: ReportPostDisplayProps) {
  const initialData = useMemo(
    () => normalizePostData({ fallback: fallbackData, postId }),
    [fallbackData, postId]
  );

  const [postData, setPostData] = useState<ReportPostDisplayData | null>(
    initialData
  );
  const [loading, setLoading] = useState<boolean>(
    Boolean(postId) && !initialData
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId || initialData) return;

    let cancelled = false;

    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/posts/${postId}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (!cancelled) {
            setError(`Failed to fetch post ${postId} (${response.status})`);
          }
          return;
        }

        const json = await response.json();
        const rawData = Array.isArray(json?.data)
          ? json.data[0]
          : json?.data ?? json;

        const normalized = normalizePostData({
          source: rawData,
          fallback: fallbackData ?? undefined,
          postId,
        });


        if (!cancelled) {
          setPostData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          console.error("ReportPostDisplay: error fetching post", err);
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [postId, fallbackData]);

  if (!postId && !postData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-gray-500">
          Post data not available for this report.
        </p>
      </div>
    );
  }

  if (loading && !postData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-gray-500">
          Loading post preview...
        </p>
      </div>
    );
  }

  if (error && !postData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-red-500">
          Failed to load post preview: {error}
        </p>
      </div>
    );
  }

  if (!postData) {
    return null;
  }

  const href = `/post/${postData.id}/${slugify(postData.title)}`;

  return (
    <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
      <div className="flex flex-col gap-4">
        <PostHeader
          isSolved={postData.is_solved}
          tags={postData.tags}
          isCurrentUserAuthor={false}
          onEditClick={() => null}
          onDeleteClick={() => null}
        />

        <Link
          href={href}
          className="group block cursor-pointer focus:outline-none"
          aria-label={`View post ${postData.title}`}
        >
          <div className="flex flex-col gap-4">
            <PostContent
              title={postData.title}
              description={postData.description}
              postImage={postData.post_image}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition-colors group-hover:border-accent-300 group-hover:bg-accent-50">
              <div className="flex items-center gap-3">
                <Avatar
                  alt={postData.author.display_name}
                  src={postData.author.profile_picture || "/default-avatar.png"}
                  className="w-8 h-8"
                />

                <div className="flex flex-col">
                  <span className="font-semibold text-dark-900">{postData.author.display_name}</span>
                  {postData.author.username && (
                    <span className="text-xs text-gray-500">
                      @{postData.author.username}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(postData.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <span className="ml-auto font-semibold text-accent-600">
                View full post →
              </span>
            </div>
          </div>
        </Link>

        {error && (
          <p className="text-xs text-amber-600">
            Unable to refresh post preview: {error}
          </p>
        )}
      </div>
    </div>
  );
}
