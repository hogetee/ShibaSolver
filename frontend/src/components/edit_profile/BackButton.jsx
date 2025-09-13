import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="w-fit flex items-center cursor-pointer gap-2 text-accent-600/70 hover:text-accent-400 font-semibold mb-4"
      onClick={() => router.back()}
    >
      <ArrowBackIcon fontSize="small" />
      Back
    </button>
  );
}
