"use client";

import ProfileContent from "@/components/profile/profile_content/ProfileContent";
import ProfileHeader from "@/components/profile/profile_header/ProfileHeader";
import React from "react";
import { useSearchParams } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";

type UserProfileProps = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  educationLevel: string; // e.g. "Undergrad"
  shibaMeter: number; // e.g. 100
  topSubjects: string[]; // e.g. ["Calculus", "Programming"]
  stats: {
    posts: number;
    comments: number;
  };
  posts: null; // list of recent posts
};

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function UserProfilePage({ searchParams }: Props) {
  // We expect routing as /user/[username]?tab=...
  // The app route provides username via the segment; this page receives searchParams for tab only.
  // We'll read username from the URL pathname client-side.
  const sp = useSearchParams();
  const tabParam = sp?.get("tab") ?? undefined;

  // Derive username from location.pathname since this component is used by app/user/[username]/page.tsx
  const username = typeof window !== 'undefined' ? (window.location.pathname.split('/').pop() || null) : null;
  const { user, isLoading, error } = useUserProfile(username);

  return (
    <div>
      <div className="min-h-[64px] bg-dark-900 text-neutral-100 flex justify-center w-[100%] items-center">
        NavBar
      </div>
      {isLoading ? (
        <div className="w-full flex justify-center py-8 text-neutral-700">Loading profile…</div>
      ) : error ? (
        <div className="w-full flex justify-center py-8 text-red-500">{error}</div>
      ) : user ? (
        <>
          <ProfileHeader dummyUser={user as unknown as any} />
          <ProfileContent searchParams={{ ...(searchParams || {}), tab: tabParam }} />
        </>
      ) : (
        <div className="w-full flex justify-center py-8 text-neutral-700">User not found.</div>
      )}
    </div>
  );
}
