"use client";

import { useRouter } from "next/navigation";
import EditIcon from '@mui/icons-material/Edit';

type Props = {
  className?: string;
};

export default function EditProfileButton({ className = "" }: Props) {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/user/edit');
  };

  return (
    <button
      onClick={handleEditProfile}
      className={`flex items-center justify-center rounded-full w-10 h-10 bg-accent-200 hover:bg-accent-400 transition-colors duration-200 shadow-md text-accent-400 hover:text-neutral-100 ${className}`}
      aria-label="Edit Profile"
    >
      <EditIcon fontSize="small"/>
      {/* <span className="text-sm font-medium">Edit Profile</span> */}
    </button>
  );
}
