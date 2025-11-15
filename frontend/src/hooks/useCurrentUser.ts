"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  user_id: number;
  user_name: string;
  display_name: string;
  google_account?: string | null;
  is_premium?: boolean;
  user_state?: string | null;
  education_level: string;
  bio?: string | null;
  interested_subjects?: string[] | null;
  profile_picture?: string | null;
  like?: number;
  dislike?: number;
};

type UseCurrentUserResult = {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useCurrentUser(): UseCurrentUserResult {
  const [data, setData] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nonce, setNonce] = useState<number>(0);

  const refetch = () => setNonce((n) => n + 1);

  useEffect(() => {
    let aborted = false;
    const controller = new AbortController();
    
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1";
        if (USE_MOCK) {
          // Simulate latency
          await new Promise((r) => setTimeout(r, 300));
          const mock: CurrentUser = {
            user_id: 1,
            user_name: "johndoe",
            display_name: "John Doe",
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
          const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
          const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
            signal: controller.signal,
            credentials: "include",
          });
          
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.message || `Request failed (${res.status})`);
          }
          
          const payload = await res.json();
          const currentUser: CurrentUser | null = payload?.data ?? null;
          if (!aborted) {
            setData(currentUser);
          }
        }
      } catch (err: any) {
        if (aborted) return;
        setError(err?.message || "Failed to load current user");
        setData(null);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchCurrentUser();
    return () => {
      aborted = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  return { user: data, isLoading: loading, error, refetch };
}

export default useCurrentUser;
