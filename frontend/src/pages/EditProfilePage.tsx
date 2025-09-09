import { exportTraceState } from "next/dist/trace";
import ProfileFrom from "@/components/edit_profile/ProfileForm";
import React from "react";


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
    const dummyUser: InformationProps = {
        id: 1,
        username: "johndoe",
        displayName: "John Doe",
        avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Avid learner and problem solver.",
        educationLevel: "Undergrad",
        shibaMeter: 100,
        topSubjects: ["Calculus", "Programming", "Data Structures"],
    };
    return(
        <div className="min-h-screen bg-purple-50 p-6 flex justify-center items-start">
            <ProfileFrom />
         </div>
    )

}
