"use client";

import { useEffect, useMemo, useState } from "react";

export type BackendUser = {
  user_id: number;
  google_account?: string | null;
  is_premium?: boolean;
  user_state?: string | null;
  user_name: string;
  display_name: string;
  education_level: string;
  like?: number;
  dislike?: number;
  bio?: string | null;
  interested_subjects?: string[] | null;
  profile_picture?: string | null;
};

export type MappedUser = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  educationLevel: string;
  shibaMeter: number;
  topSubjects: string[];
  stats: { posts: number; comments: number };
  posts: null;
};

type UseUserResult = {
  user: MappedUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

// Helper to map backend shape to UI shape we already use across components
function mapBackendToUi(user: BackendUser, shibaMeter: number): MappedUser {
  // const likes = typeof user.like === "number" ? user.like : 0;
  // const dislikes = typeof user.dislike === "number" ? user.dislike : 0;
  // // Temporary shibaMeter calculation until backend provides a dedicated score
  // shibaMeter = Math.max(0, Math.min(100, 3 + (likes - dislikes)));

  return {
    id: user.user_id,
    username: user.user_name,
    displayName: user.display_name,
    avatarUrl: user.profile_picture ?? undefined,
    bio: user.bio ?? undefined,
    educationLevel: user.education_level,
    shibaMeter,
    topSubjects: user.interested_subjects ?? [],
    stats: { posts: 0, comments: 0 },
    posts: null,
  };
}

export function useUserProfile(username?: string | null): UseUserResult {
  const [data, setData] = useState<BackendUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shibaMeter, setShibaMeter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [nonce, setNonce] = useState<number>(0);

  const refetch = () => setNonce((n) => n + 1);

  useEffect(() => {
    if (!username) return;
    let aborted = false;
    const controller = new AbortController();
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";
        if (USE_MOCK) {
          // Simulate latency
          await new Promise((r) => setTimeout(r, 300));
          const mock: BackendUser = {
            user_id: 1,
            user_name: username,
            display_name: username.charAt(0).toUpperCase() + username.slice(1),
            education_level: "Undergrad",
            bio: "Avid learner and problem solver.",
            interested_subjects: ["Calculus", "Programming", "Data Structures"],
            profile_picture: "/image/DefaultAvatar.png",
            like: 12,
            dislike: 2,
            google_account: null,
            is_premium: false,
            user_state: "active",
          };
          if (!aborted) setData(mock);
        } else {
          // Adjust BASE_URL to your backend origin as needed
          const BASE_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
          // Backend should provide this route; alternatively implement resolve-username -> id
          const res = await fetch(
            `${BASE_URL}/api/v1/users/${encodeURIComponent(username)}`,
            {
              signal: controller.signal,
              credentials: "include",
            }
          );

          const shibaRes = await fetch(
            `${BASE_URL}/api/v1/users/${encodeURIComponent(
              username
            )}/shibameter`,
            {
              signal: controller.signal,
              credentials: "include",
            }
          );

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Request failed (${res.status})`);
          }

          if (!shibaRes.ok) {
            const body = await shibaRes.json().catch(() => ({}));
            throw new Error(body?.message || `Failed to fetch shiba meter (${shibaRes.status})`);
          }

          const payload = await res.json();
          const shibaPayload = await shibaRes.json();

          const backendUser: BackendUser | null = payload?.data ?? null;
          const shibaScore: number = shibaPayload?.shibaMeter ?? 0;

          console.log("Shiba meter API success:", {
            username,
            shibaScore,
            fullResponse: shibaPayload
          });
          
          if (!aborted) {
            setData(backendUser);
            setShibaMeter(shibaScore);
          }
        }
      } catch (err: any) {
        if (aborted) return;
        setError(err?.message || "Failed to load user");
        setData(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      aborted = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, nonce]);

  const user = useMemo(() => (data ? mapBackendToUi(data, shibaMeter) : null), [data, shibaMeter]);

  return { user, isLoading: loading, error, refetch };
}

export default useUserProfile;
