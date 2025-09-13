'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Reuse existing building blocks from the edit_profile set
import TextInput from '@/components/edit_profile/TextInput';
import TextArea from '@/components/edit_profile/TextArea';
import SelectDropdown from '@/components/edit_profile/SelectDropdown';
import Checkbox from '@/components/edit_profile/CheckBox';
import ProfilePicture from '@/components/edit_profile/ProfilePicture';

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
  { name: 'Math', color: 'blue' },
  { name: 'Physics', color: 'green' },
  { name: 'Chemistry', color: 'purple' },
  { name: 'Biology', color: 'red' },
  { name: 'English', color: 'orange' },
  { name: 'History', color: 'gray' },
];

const educationLevels = ['High School', 'Undergraduate', 'Graduate', 'Other'];

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003';
}

export default function RegisterForm({ initial = {} }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: initial.username || '',
    displayName: initial.displayName || '',
    bio: initial.bio || '',
    education: initial.education || '',
    subjects: initial.subjects || ([] as any[]),
    agree: false,
    profilePic: initial.profilePic || null as null | string,
  });

  const [errors, setErrors] = useState({ username: false, displayName: false, submit: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubjectsChange = (selected: any[]) => {
    setFormData((prev) => ({ ...prev, subjects: selected }));
  };

  const handleProfilePicChange = (fileOrUrl: any) => {
    setFormData((prev) => ({ ...prev, profilePic: fileOrUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username: !formData.username.trim(),
      displayName: !formData.displayName.trim(),
      submit: '',
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.displayName || !formData.agree) return;

    const payload = {
      user_name: formData.username.trim(),
      display_name: formData.displayName.trim(),
      bio: formData.bio || null,
      education_level: formData.education || null,
      interested_subjects: (formData.subjects || []).map((s: any) =>
        typeof s === 'string' ? s : s?.name
      ),
      profile_picture: typeof formData.profilePic === 'string' ? formData.profilePic : null,
    };

    try {
      const res = await fetch(`${apiBase()}/api/v1/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ new_data: payload }),
      });
      const json = await res.json();

      if (!json.success) {
        const msg = (json?.error?.message as string) || (json?.message as string) || 'Could not save profile';
        setErrors((prev) => ({ ...prev, submit: msg }));
        return;
      }

      const username = json.data?.user_name || payload.user_name;
      if (username) localStorage.setItem('username', username);
      router.push(`/user/${username}`);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: 'Network error. Please try again.' }));
    }
  };

  return (
    <div className="p-5 rounded-2xl w-[65%] flex flex-col gap-6 font-display">
      <div className="text-center text-6xl font-medium">Set up your profile</div>

      <form onSubmit={handleSubmit} className="bg-[var(--color-accent-200)] p-5 rounded-3xl min-h-[700px] flex flex-col gap-5">
        <TextInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="username"
          required
        />

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
              <label className="font-semibold">Education level</label>
              <SelectDropdown
                options={educationLevels}
                value={formData.education as any}
                onChange={(val: string) => setFormData((prev) => ({ ...prev, education: val }))}
                placeholder="Select your education level"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Interested Subject(s)</label>
              <SelectDropdown
                options={subjects}
                value={formData.subjects as any}
                onChange={handleSubjectsChange}
                placeholder="Select your subjects"
                multiple
              />
            </div>
          </div>

          {/* <div className="w-1/3 flex justify-center">
            <ProfilePicture value={formData.profilePic as any} onChange={handleProfilePicChange} />
          </div> */}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <Checkbox
            name="agree"
            checked={formData.agree as any}
            onChange={handleChange as any}
            label={<>Agree to <a href="#" className="text-blue-600 underline">Terms & Agreement</a></>}
          />

          <button type="submit" className="bg-purple-800 text-white px-4 py-2 rounded">Submit</button>
        </div>

        {errors.submit && <div className="text-red-600 text-sm mt-2">{errors.submit}</div>}
      </form>
    </div>
  );
}

