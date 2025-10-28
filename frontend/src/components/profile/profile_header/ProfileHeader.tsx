'use client'; 

import React, { useState } from 'react'; 
import ProfilePic from "./ProfilePic";
import BioCard from "./BioCard";
import InfoBlock from "./InfoBlock";
import Shibameter from "./Shibameter";
import TopSubject from "./TopSubjects";
import EditProfileButton from "./EditProfileButton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { FlagIcon } from '@heroicons/react/24/outline'; 
import ReportUserModal from './ReportUserModal';

type UserProfile = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  educationLevel: string;
  shibaMeter: number;
  topSubjects: string[];
  stats: {
    posts: number;
    comments: number;
  };
  posts: unknown;
};

type Props = {
  dummyUser: UserProfile;
};

export default function ProfileHeader({ dummyUser }: Props) {
  const { user: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  
  // Check if the current user is viewing their own profile
  const isOwnProfile = currentUser && currentUser.user_name === dummyUser.username;

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
  <>
    <div className="w-[100%] px-6 pt-8 font-display flex justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        {/* Left: Avatar */}
        <div className="flex items-center justify-center md:justify-start">
          <div className="relative inline-block">
            <ProfilePic
              src={dummyUser.avatarUrl}
              alt={dummyUser.displayName}
              responsiveSize={{ xs: 112, md: 144, lg: 160 }}
            />
            {!currentUserLoading && isOwnProfile && (
              <EditProfileButton className="absolute -bottom-1 -right-1 z-10 cursor-pointer" />
            )}
          </div>
        </div>
        {/* Middle: Info + Bio (with Shibameter inline on small) */}
        <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
          <InfoBlock
            displayName={dummyUser.displayName}
            username={dummyUser.username}
            educationLevel={dummyUser.educationLevel}
            inlineRight={<Shibameter value={dummyUser.shibaMeter} />}
          />
          <div className="w-[100%]">
            <BioCard bio={dummyUser.bio} />
          </div>
          {/* Edit button moved to avatar overlay */}
        </div>
        {/* Right: Shibameter + Top Subjects on md+ */}
        <div className="hidden md:flex md:flex-col items-stretch gap-4 md:gap-6 md:self-stretch p-[0.5rem]">
          <div className="flex justify-end w-[100%]">
            <Shibameter value={dummyUser.shibaMeter} />
          </div>
          <div className="flex items-start">
            <TopSubject subjects={dummyUser.topSubjects} />
          </div>
            {!currentUserLoading && !isOwnProfile && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 transition-colors"
                >
                  <FlagIcon className="w-4 h-4" />
                  Report
                </button>
              </div>
            )}
        </div>
        {/* Bottom on small: Top Subjects */}
        <div className="md:hidden">
          <TopSubject subjects={dummyUser.topSubjects} />
            {!currentUserLoading && !isOwnProfile && (
              <div className="flex justify-center mt-4"> {/* จัดให้อยู่ตรงกลาง */}
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 transition-colors"
                >
                  <FlagIcon className="w-4 h-4" />
                  Report this user
                </button>
              </div>
            )}
        </div>
            
      </div>
    </div>

    {/* ... (Modal Logic - เหมือนเดิม) ... */}
      {isReportModalOpen && (
        <ReportUserModal
          userId={String(dummyUser.id)} 
          userName={dummyUser.displayName}
          onClose={() => setIsReportModalOpen(false)}
        />
    )}
  </>
  );
}
