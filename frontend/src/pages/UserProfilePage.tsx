import ProfileContent from "@/components/profile/profile_content/ProfileContent";
import ProfileHeader from "@/components/profile/profile_header/ProfileHeader";
import React from "react";

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
  // supposedly fetch user data based on props.id or props.username
  // real implementation should not pass in the whole props, just get useParams and fetch data of u/{username}

  const dummyUser: UserProfileProps = {
    id: 1,
    username: "johndoe",
    displayName: "John Doe",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Avid learner and problem solver.",
    educationLevel: "Undergrad",
    shibaMeter: 100,
    topSubjects: ["Calculus", "Programming", "Data Structures"],
    stats: {
      posts: 42,
      comments: 128,
    },
    posts: null, // would be a list of recent posts
  };

  return (
    <div>
      <div className="min-h-[64px] bg-dark-900 text-neutral-100 flex justify-center w-[100%] items-center">
        NavBar
      </div>
      {/* Add your user page content here */}
      <ProfileHeader dummyUser={dummyUser} />
      <ProfileContent searchParams={searchParams} />
    </div>
  );
}
