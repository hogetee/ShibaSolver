"use client";

import ProfileFrom from "@/components/edit_profile/ProfileForm";
import React from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import ShibaError from "@/components/error/ShibaError";

type InformationProps = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  educationLevel: string; // e.g. "Undergrad"
  shibaMeter: number; // e.g. 100
  topSubjects: string[]; // e.g. ["Calculus", "Programming"]
};

export default function InformationPage(){
    const { user: currentUser, isLoading, error } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="max-h-screen p-6 flex justify-center items-start">
                <div className="p-5 rounded-2xl w-[65%] h-full flex flex-col gap-6 font-display">
                    <div className="text-center text-6xl font-medium text-dark-900">
                        Edit your profile
                    </div>
                    <div className="bg-[var(--color-accent-200)] p-5 rounded-3xl min-h-[700px] flex items-center justify-center">
                        <div className="text-lg text-neutral-600">Loading your profile...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-h-screen p-6 flex justify-center items-start">
                <div className="p-5 rounded-2xl w-[65%] h-full flex flex-col gap-6 font-display">
                    <div className="text-center text-6xl font-medium text-dark-900">
                        Edit your profile
                    </div>
                    <div className="bg-[var(--color-accent-200)] p-5 rounded-3xl min-h-[700px] flex items-center justify-center">
                        <ShibaError message={error} />
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="max-h-screen p-6 flex justify-center items-start">
                <div className="p-5 rounded-2xl w-[65%] h-full flex flex-col gap-6 font-display">
                    <div className="text-center text-6xl font-medium text-dark-900">
                        Edit your profile
                    </div>
                    <div className="bg-[var(--color-accent-200)] p-5 rounded-3xl min-h-[700px] flex items-center justify-center">
                        <div className="text-lg text-neutral-600">Please log in to edit your profile.</div>
                    </div>
                </div>
            </div>
        );
    }

    // Map current user data to the format expected by ProfileForm
    const userData: InformationProps = {
        id: currentUser.user_id,
        username: currentUser.user_name,
        displayName: currentUser.display_name,
        avatarUrl: currentUser.profile_picture || undefined,
        bio: currentUser.bio || "",
        educationLevel: currentUser.education_level,
        shibaMeter: 100, // This would need to be calculated or fetched separately
        topSubjects: currentUser.interested_subjects || [],
    };

    return(
        <div className="max-h-screen p-6 flex justify-center items-start">
            <ProfileFrom userData={userData} />
         </div>
    )
}
