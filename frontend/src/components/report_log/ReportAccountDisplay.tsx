"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Avatar } from "@mui/material";

export interface ReportAccountDisplayData {
  user_id: string;
  display_name: string;
  username: string;
  profile_picture?: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5003";

const DEFAULT_AVATAR = "/image/DefaultAvatar.png";

type ReportAccountDisplayProps = {
  userId?: string | null;
  fallbackData?: Partial<ReportAccountDisplayData> | null;
};

function normalizeAccountData({
  source,
  fallback,
  userId,
}: {
  source?: any;
  fallback?: Partial<ReportAccountDisplayData> | null;
  userId?: string | null;
}): ReportAccountDisplayData | null {
  const fallbackData = fallback ?? undefined;
  const raw = source ?? undefined;

  const hasAnyData = raw || fallbackData;
  if (!hasAnyData && !userId) {
    return null;
  }

  const resolvedId =
    raw?.user_id ??
    raw?.id ??
    fallbackData?.user_id ??
    userId ??
    null;

  if (!resolvedId) {
    return null;
  }

  return {
    user_id: String(resolvedId),
    display_name:
      raw?.display_name ??
      fallbackData?.display_name ??
      "Unknown user",
    username:
      raw?.username ??
      fallbackData?.username ??
      "",
    profile_picture:
      raw?.profile_picture ??
      fallbackData?.profile_picture ??
      DEFAULT_AVATAR,
  };
}

export default function ReportAccountDisplay({
  userId,
  fallbackData = null,
}: ReportAccountDisplayProps) {
  const initialData = useMemo(
    () => normalizeAccountData({ fallback: fallbackData, userId }),
    [fallbackData, userId]
  );

  const [accountData, setAccountData] = useState<ReportAccountDisplayData | null>(
    initialData
  );
  const [loading, setLoading] = useState<boolean>(
    Boolean(userId) && !initialData
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || initialData) return;

    let cancelled = false;

    async function fetchAccount() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/users/${userId}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const json = await response.json().catch(() => null);

        if (!response.ok) {
          if (!cancelled) {
            const statusMessage =
              json?.message || json?.error || `Failed to fetch user ${userId} (${response.status})`;
            setError(statusMessage);
          }
          return;
        }

        const rawData = Array.isArray(json?.data)
          ? json.data[0]
          : json?.data ?? json;

        const normalized = normalizeAccountData({
          source: rawData,
          fallback: fallbackData ?? undefined,
          userId,
        });

        if (!cancelled) {
          setAccountData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          console.error("ReportAccountDisplay: error fetching user", err);
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchAccount();

    return () => {
      cancelled = true;
    };
  }, [userId, fallbackData]);

  if (!userId && !accountData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-gray-500">
          Account data not available for this report.
        </p>
      </div>
    );
  }

  if (loading && !accountData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-gray-500">
          Loading account preview...
        </p>
      </div>
    );
  }

  if (error && !accountData) {
    return (
      <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
        <p className="text-center text-sm text-red-500">
          Failed to load account preview: {error}
        </p>
      </div>
    );
  }

  if (!accountData) {
    return null;
  }

  const href = `/user/${accountData.username}`;

  return (
    <div className="w-full rounded-2xl bg-white p-6 font-display shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <span>Reported Account</span>
        </div>

        <Link
          href={href}
          className="group block cursor-pointer focus:outline-none"
          aria-label={`View profile of ${accountData.display_name}`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <Avatar
                alt={accountData.display_name}
                src={accountData.profile_picture || DEFAULT_AVATAR}
                sx={{ width: 64, height: 64 }}
              />

              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark-900 group-hover:text-accent-600 transition-colors">
                  {accountData.display_name}
                </h3>
                
                {accountData.username && (
                  <p className="text-sm text-gray-600 mt-1">
                    @{accountData.username}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm transition-colors group-hover:border-accent-300 group-hover:bg-accent-50">
              <span className="font-semibold text-accent-600">
                View profile →
              </span>
            </div>
          </div>
        </Link>

        {error && (
          <p className="text-xs text-amber-600">
            Unable to refresh account preview: {error}
          </p>
        )}
      </div>
    </div>
  );
}
