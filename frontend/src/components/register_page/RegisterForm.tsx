"use client";

import React from "react";
import { useState } from "react";


// Reuse existing building blocks from the edit_profile set
import TextInput from "@/components/edit_profile/TextInput";
import TextArea from "@/components/edit_profile/TextArea";
import SelectDropdown from "@/components/edit_profile/SelectDropdown";
import Checkbox from "@/components/edit_profile/CheckBox";
import ProfilePicture from "@/components/edit_profile/ProfilePicture";

import { useRegisterForm } from "@/hooks/useRegisterForm";
import DataPolicy from "../datapolicy/DataPolicy";

type Initial = {
  username?: string;
  displayName?: string;
  bio?: string;
  education?: string;
  subjects?: Array<string | { name: string; color?: string }>;
  profilePic?: string | null;
};

type Props = {
  initial?: Initial;
};

// Example options (match styling of existing components)
const subjects = [
  { name: "Math", color: "indigo" },
  { name: "Physics", color: "amber" },
  { name: "Chemistry", color: "violet" },
  { name: "Biology", color: "forest" },
  { name: "English", color: "magenta" },
  { name: "History", color: "sienna" },
  { name: "Geography", color: "teal" },
  { name: "Economics", color: "tangerine" },
  { name: "Law", color: "charcoal" },
  { name: "Thai", color: "crimson" },
  { name: "Chinese", color: "gold" },
  { name: "Programming", color: "periwinkle" },
  { name: "Others", color: "slate" },
];

// const tagColorMap: Record<string, string> = {
//   Math: "bg-[#2563EB]",
//   Physics: "bg-[#FF9D00]",
//   Chemistry: "bg-[#9333EA]",
//   Biology: "bg-[#467322]",
//   History: "bg-[#893F07]",
//   Geography: "bg-[#1E6A91]",
//   Economics: "bg-[#FA733E]",
//   Law: "bg-[#000000]",
//   Thai: "bg-[#83110F]",
//   English: "bg-[#BE0EA7]",
//   Chinese: "bg-[#CBC400]",
//   Programming: "bg-[#6366F1]",
//   Others: "bg-[#63647A]",
// };

const educationLevels = ["High School", "Undergraduate", "Graduate", "Other"];

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";
}

export default function RegisterForm({ initial = {} }: Props) {
  const {
    formData,
    errors,
    usernameStatus,
    handleChange,
    handleSubjectsChange,
    handleProfilePicChange,
    handleEducationChange,
    handleSubmit,
  } = useRegisterForm({ initial });
  const [showDataPolicy, setShowDataPolicy] = useState(false);

  return (
    <div className="p-5 rounded-2xl w-[65%] flex flex-col gap-6 font-display">
      <div>
        <div className="text-center text-6xl font-medium text-dark-900">
          Set up your profile
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-accent-200)] mt-4 p-5 rounded-3xl min-h-[700px] flex flex-col gap-5"
        >
          <TextInput
            label={
              <>
                Username
                <span className="ml-2 text-sm font-normal text-gray-600">
                  3–20 chars (A-Z, a-z, 1234567890, _ or -)
                </span>
              </>
            }
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="username"
            required
          />

          {/* Username availability feedback */}
          {formData.username && (
            <div className="text-sm">
              {usernameStatus === "checking" && (
                <span className="text-gray-500">Checking availability…</span>
              )}
              {usernameStatus === "available" && (
                <span className="text-green-600">Username is available</span>
              )}
              {usernameStatus === "taken" && (
                <span className="text-red-600">Username is already taken</span>
              )}
              {usernameStatus === "error" && (
                <span className="text-red-600">
                  Use 3–20 letters, numbers, _ or -
                </span>
              )}
            </div>
          )}

          <TextInput
            label="Display Name"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            error={errors.displayName}
            placeholder="display name"
            required
          />

          <TextArea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write something about yourself"
          />

          <div className="flex gap-6">
            <div className="flex flex-col gap-5 w-2/3">
              <div className="flex flex-col">
                <label className="font-semibold text-dark-900">
                  Education level
                </label>

                <SelectDropdown
                  options={educationLevels}
                  value={formData.education as any}
                  onChange={handleEducationChange}
                  placeholder="Select your education level"
                  multiple={false}
                  color={false}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-dark-900">
                  Interested Subject(s)
                </label>

                <SelectDropdown
                  options={subjects}
                  value={formData.subjects as any}
                  onChange={handleSubjectsChange}
                  placeholder="Select your subjects"
                  multiple={true}
                  color={false}
                  maxSelections={3}
                />
              </div>
            </div>

            {/* Right side - Profile Picture */}
            <div className="w-1/3 flex justify-center mt-5">
              <ProfilePicture
                value={formData.profilePic as any}
                onChange={handleProfilePicChange}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto text-dark-900">
            <div className="flex flex-col">
              <Checkbox
                name="agree"
                checked={formData.agree as any}
                onChange={handleChange as any}
                label={
                  <>
                    Agree to{" "}
                    <a className="text-blue-600 underline cursor-pointer" onClick={() => {setShowDataPolicy(true);}}>
                      Terms & Agreements
                    </a>
                  </>
                }
              />
              {errors.agree && (
                <div className="text-red-600 text-sm mt-1">
                  You Must Agree to Terms & Agreements to Signup
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                usernameStatus === "taken" ||
                usernameStatus === "checking" ||
                usernameStatus === "error"
              }
              className={`bg-accent-600 text-white px-4 py-2 rounded cursor-pointer ${
                usernameStatus === "taken" ||
                usernameStatus === "checking" ||
                usernameStatus === "error"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-accent-600/80"
              }`}
            >
              Submit
            </button>
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm mt-2">{errors.submit}</div>
          )}
        </form>
      </div>
      {showDataPolicy && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <DataPolicy onClose={() => setShowDataPolicy(false)} />
        </div>
      )}
    </div>
  );
}
